document.addEventListener('DOMContentLoaded', function () {
	const tabSymbolsButton = document.getElementById('tabSymbolsButton');
	const tabConverterButton = document.getElementById('tabConverterButton');
	const symbolsBody = document.getElementById('symbolsBody');

	const convertButton = document.getElementById('convertButton');
	const svgInput = document.getElementById('svgInput');
	const conversionResult = document.getElementById('conversionResult');

	// Automatically extract SVG symbols when popup opens
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.scripting.executeScript({
			target: { tabId: tabs[0].id },
			function: extractSVGSymbols,
		}, (injectionResults) => {
			if (chrome.runtime.lastError) {
				console.error(chrome.runtime.lastError);
				symbolsBody.innerHTML = '<tr><td colspan="3">Error: ' + chrome.runtime.lastError.message + '</td></tr>';
				return;
			}

			createSVGTable(injectionResults[0].result);
		});
	});

	// tab 切換
	tabSymbolsButton.addEventListener('click', () => {
		openTab('tabSymbolsContent');
	});
	tabConverterButton.addEventListener('click', () => {
		openTab('tabConverterContent');
	});

	tabSymbolsButton.click();


	// SVG Converter functionality
	convertButton.addEventListener('click', function () {
		const svgCode = svgInput.value;
		// Implement your SVG conversion logic here
		// For now, we'll just display the input as-is
		conversionResult.textContent = svgCode;
	});

});

function extractSVGSymbols() {
	const svgElements = Array.from(document.querySelectorAll('svg'));
	const symbols = [];

	for (let svgEl of svgElements) {
		const symbolElements = Array.from(svgEl.querySelectorAll('symbol'));
		for (let symbol of symbolElements) {
			symbols.push({
				id: symbol.id,
				viewBox: symbol.getAttribute('viewBox') || '0 0 24 24', // default viewBox if not specified
				outerHTML: symbol.outerHTML
			});
		}
	}

	return symbols;
}

function bindSVGCopyButton() {
	// Add event listeners to copy buttons
	document.querySelectorAll('.copy-button').forEach(button => {
		button.addEventListener('click', function () {
			const idToCopy = this.getAttribute('data-id');
			const text = this.textContent;
			navigator.clipboard.writeText(idToCopy).then(() => {
				this.textContent = 'OK';
				setTimeout(() => {
					this.textContent = text;
				}, 2000);
			});
		});
	});
}

function createSVGElement(symbolsHTML) {
	const symbolsBody = document.getElementById('symbolsBody');
	const svgHTML = `
	<svg width="0" height="0" style="display:none;">
		${symbolsHTML.join('')}
	</svg>
	`;
	symbolsBody.innerHTML += svgHTML;
}

function createSVGTable(symbols) {
	const symbolsBody = document.getElementById('symbolsBody');
	const svgElements = [];
	if (symbols && symbols.length > 0) {
		symbols.forEach(function (symbol) {
			// 先將原本的 symbol 塞入
			svgElements.push(symbol.outerHTML);

			const row = document.createElement('tr');
			const idWithoutPrefix = symbol.id.replace(/^icon_/, '');

			row.innerHTML = `
					<td>${symbol.id}</td>
					<td><svg class="icon-preview" viewBox="${symbol.viewBox}"><use href="#${symbol.id}"></use></svg></td>
					<td><button class="copy-button" data-id="${idWithoutPrefix}">Copy</button></td>
			`;

			symbolsBody.appendChild(row);
		});
		createSVGElement(svgElements);
		bindSVGCopyButton();

	} else {
		symbolsBody.innerHTML = '<tr><td colspan="3">No SVG symbols found on this page.</td></tr>';
	}
}

function openTab(target) {
	const targetContent = document.getElementById(target);
	const parent = targetContent.parentElement;
	// 取得父層的所有子元素（同層元素）
	const siblings = Array.from(parent.children).filter(
		(el) => el !== targetContent // 排除目前的按鈕
	);
	siblings.forEach((item) => item.classList.remove('active'));
	targetContent.classList.add('active');
}