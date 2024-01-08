let serverEventNode;

export default async function setupCounts() {
	const countDiv = document.createElement('div');
	const globalHeader = document.createElement('h2');
	globalHeader.textContent = 'Global stats';
	countDiv.appendChild(globalHeader);
	// countDiv.innerText = 'keys pressed: 3';
	const countDivCOunters = document.createElement('div');
	countDivCOunters.innerText = 'Keys Pressed: ';
	countDiv.classList.add('count');
	countDiv.appendChild(countDivCOunters);
	serverEventNode = new EventSource('/sse');
	serverEventNode.onmessage = ({data}) => {
		countDivCOunters.innerText = `Keys pressed: ${data}`;
	};
	return countDiv;
}
