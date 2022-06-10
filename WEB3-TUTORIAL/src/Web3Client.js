import NFTContractBuild from 'contracts/NFT.json';
import Web3 from 'web3';
import RequestContractBuild from 'contracts/RequestManager.json';


let selectedAccount;
let erc20Contract;
let requestContract;
let BurnContract;
let readContract;
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

	const networkId = await web3.eth.net.getId();

	const erc20Abi = [
		{
			constant: true,
			inputs: [
				{
					name: '_owner',
					type: 'address'
				}
			],
			name: 'balanceOf',
			outputs: [
				{
					name: 'balance',
					type: 'uint256'
				}
			],
			payable: false,
			stateMutability: 'view',
			type: 'function'
		}
	];

	const requestabi = [{
		inputs: [
			{
				"internalType": "string",
				"name": "_gameID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		name: "requestMint",
		outputs: [],
		stateMutability: "nonpayable",
		type : "function"
	}];

	const requestBurnabi = [{
		inputs: [
			{
				"internalType": "string",
				"name": "_gameID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "_amount",
				"type": "uint256"
			}
		],
		name: "requestBurn",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function"
	}];

	const readabi = [
		{
			inputs: [],
			name: "read",
			outputs: [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				},
				{
					"internalType": "string[]",
					"name": "",
					"type": "string[]"
				},
				{
					"internalType": "uint256[]",
					"name": "",
					"type": "uint256[]"
				},
				{
					"internalType": "bool[]",
					"name": "",
					"type": "bool[]"
				}
			],
			stateMutability: "view",
			type: "function"
		}
	];

	erc20Contract = new web3.eth.Contract(
		erc20Abi,
		// Dai contract on Rinkeby
		'0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea'
	);
	
	BurnContract = new web3.eth.Contract(
		requestBurnabi, '0xa2dcf71C4a85EBA1d62eAc9EBfFC610291b80f37'
	);

	readContract = new web3.eth.Contract(
		readabi, '0xa2dcf71C4a85EBA1d62eAc9EBfFC610291b80f37'
	);
	requestContract = new web3.eth.Contract(
		requestabi, '0xa2dcf71C4a85EBA1d62eAc9EBfFC610291b80f37'
	);

	isInitialized = true;
};

export const getOwnBalance = async () => {
	if (!isInitialized) {
		await init();
	}

	return erc20Contract.methods
		.balanceOf(selectedAccount)
		.call()
		.then((balance) => {
			return Web3.utils.fromWei(balance);
		});
};

export const requestMint = async () => {
	if (!isInitialized) {
		await init();
	}

	return requestContract.methods
		.requestMint("bbb", 10)
		.send({from: selectedAccount});
}

export const requestMint2 = async (gameID, amount) => {
	if (!isInitialized) {
		await init();
	}

	return requestContract.methods
		.requestMint(gameID, amount)
		.send({from: selectedAccount});
}

export const requestBurn = async (gameID, amount) => {
	if (!isInitialized) {
		await init();
	}

	return BurnContract.methods
		.requestBurn(gameID, amount)
		.send({from: selectedAccount});
}

export const read = async() => {
	if (!isInitialized) {
		await init();
	}

	return readContract.methods.read().send({from: selectedAccount});
}

