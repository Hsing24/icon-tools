chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.action === "render_svg_symbols") {
		renderSVGSymbols();
	}
});

function renderSVGSymbols() {
	// 找到所有的SVG元素
	const svgs = document.getElementsByTagName('svg');

	// 創建一個容器來放置渲染後的symbol
	const container = document.createElement('div');
	container.style.position = 'fixed';
	container.style.top = '0';
	container.style.left = '0';
	container.style.width = '100%';
	container.style.height = '100%';
	container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
	container.style.zIndex = '9999';
	container.style.overflow = 'auto';
	container.style.padding = '20px';

	// 遍歷每個SVG元素
	for (let svg of svgs) {
		// 找到所有的symbol元素
		const symbols = svg.getElementsByTagName('symbol');

		// 遍歷每個symbol並渲染
		for (let symbol of symbols) {
			const renderedSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			renderedSvg.setAttribute('width', '100');
			renderedSvg.setAttribute('height', '100');

			const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
			use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#' + symbol.id);

			renderedSvg.appendChild(use);

			const wrapper = document.createElement('div');
			wrapper.style.display = 'inline-block';
			wrapper.style.margin = '10px';
			wrapper.style.backgroundColor = 'white';
			wrapper.style.padding = '10px';

			const label = document.createElement('p');
			label.textContent = symbol.id;
			label.style.textAlign = 'center';
			label.style.color = 'black';

			wrapper.appendChild(renderedSvg);
			wrapper.appendChild(label);
			container.appendChild(wrapper);
		}
	}

	// 添加關閉按鈕
	const closeButton = document.createElement('button');
	closeButton.textContent = '關閉';
	closeButton.style.position = 'fixed';
	closeButton.style.top = '10px';
	closeButton.style.right = '10px';
	closeButton.style.zIndex = '10000';
	closeButton.onclick = function () {
		document.body.removeChild(container);
	};

	container.appendChild(closeButton);
	document.body.appendChild(container);
}