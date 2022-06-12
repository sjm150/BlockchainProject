import NFTContractBuild from 'contracts/NFT.json';
import Web3 from 'web3';
import RequestContractBuild from 'contracts/RequestManager.json';
import factoryBuild from 'contracts/Factory.json';
import tokenBuild from 'contracts/ERC20Example.json';

let selectedAccount;
let erc20Contract;
let requestContract;
let BurnContract;
let readContract;
let erc20ExampleContract;
let factoryContract;
let isInitialized = false;

export const init = async () => {
	let provider = window.ethereum;

	if (typeof provider !== 'undefined') {
		provider
			.request({ method: 'eth_requestAccounts' })
			.then((accounts) => {
				selectedAccount = accounts[0];
				console.log(`Selected account is ${selectedAccount}`);
			})
			.catch((err) => {
				console.log(err);
				return;
			});

		window.ethereum.on('accountsChanged', function (accounts) {
			selectedAccount = accounts[0];
			console.log(`Selected account changed to ${selectedAccount}`);
		});
	}

	const web3 = new Web3(provider);

	const erc20ExAbi = [
		{
			inputs: [],
			name: "name",
			"outputs": [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			stateMutability: "view",
			type: "function"
		},
		{
			inputs: [],
			name: "symbol",
			outputs: [
				{
					"internalType": "string",
					"name": "",
					"type": "string"
				}
			],
			stateMutability: "view",
			type: "function"
		},
		{
			inputs: [],
			name: "totalSupply",
			outputs: [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			stateMutability: "view",
			type: "function"
		}
	
	];

	factoryContract = new web3.eth.Contract(
		factoryBuild.abi, "0xb774abA64eE5e6DE4238D48AFC41D3EeB2A2D775"
	);


	erc20ExampleContract = new web3.eth.Contract(
		erc20ExAbi,
		'0xB93c86916ca6c5526faF2F2Fb83c8990283c3435'
	);
	

	isInitialized = true;
};


export const requestMint2 = async (gameID, amount, managerAddr) => {
	if (!isInitialized) {
		await init();
	}

	let mintContract;
	let provider = window.ethereum;
	const web3 = new Web3(provider);
	mintContract = new web3.eth.Contract(
		RequestContractBuild.abi, managerAddr
	);

	return mintContract.methods
		.requestMint(gameID, amount)
		.send({from: selectedAccount});
}

export const requestBurn = async (gameID, amount, managerAddr) => {
	if (!isInitialized) {
		await init();
	}
	let burnContract;
	let provider = window.ethereum;
	const web3 = new Web3(provider);
	burnContract = new web3.eth.Contract(
		RequestContractBuild.abi, managerAddr
	);

	return burnContract.methods
		.requestBurn(gameID, amount)
		.send({from: selectedAccount});
}

export const read = async() => {
	if (!isInitialized) {
		await init();
	}

	return readContract.methods.read().send({from: selectedAccount});
}

export const getTokenInfo = async (address) => {
	if (!isInitialized) {
		await init();
	}
	let tokenContract;
	let provider = window.ethereum;
	const web3 = new Web3(provider);
	tokenContract = new web3.eth.Contract(
		tokenBuild.abi, address
	);
	const name = await tokenContract.methods.name().call();
	return name;
};

export const getTokenSymbol = async (address) => {
	if (!isInitialized) {
		await init();
	}
	let tokenContract;
	let provider = window.ethereum;
	const web3 = new Web3(provider);
	tokenContract = new web3.eth.Contract(
		tokenBuild.abi, address
	);
	const symbol = await tokenContract.methods.symbol().call();
	return symbol;
};

export const getTokenSupply = async (address) => {
	if (!isInitialized) {
		await init();
	}
	let tokenContract;
	let provider = window.ethereum;
	const web3 = new Web3(provider);
	tokenContract = new web3.eth.Contract(
		tokenBuild.abi, address
	);
	const supply = await tokenContract.methods.totalSupply().call();
	return supply;
};
