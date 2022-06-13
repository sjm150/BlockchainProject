import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { getOwnBalance, requestMint, requestMint2, requestBurn, read, getTokenInfo, getTokenSymbol, getTokenSupply } from './Web3Client';
import TxList from './TxList';
import tokenBuild from 'contracts/ERC20Example.json';

function App() {
	const [txs, setTxs] = useState([]);
	const [requested, setRequsted] = useState(false);
	const [balance, setBalance] = useState(0);
	const [tokenN, setTokenN] = useState("-");
	const [tokenS, setTokenS] = useState("-");
	const [tokenTS, setTokenTS] = useState("-");
	const [nowSelectedCoin, setNowSelectedCoin] = useState("-");
	const [nowSelectedManager, setNowSelectedManager] = useState("-");

	const M = "0x835666fa482B1CD711635cE2Cfc926F2c5584Ad5";
	const T = "0x92bDEfAA26eBbde02844814EF49A03AE402f2a95";
	const W = "0x9f1beC0a2fD1568Faf1B23A70b95d12d5cCd6D69";
	const E = "0x82D14aE2ca5CB1edF8fd58818dEFc91BEeb3765A";
	const P = "0x1Dd8eEF5aD7774A1B27989A697D4B14BefAd77eF";
	const Mmanager ="0x3156b6123D091b807b627397875282361e87F165";
	const Tmanager ="0xe7d8cB353215a81870c4a3273C2517EbAf3B1eE2";
	const Wmanager ="0x941015C08Dd514b7c3ee97e6Be428A537210D8e7";
	const Emanager ="0xFD1ee5c97cC5FBEd3F6f30537f8c48673Fb29D0A";
	const Pmanager ="0x0641ac60606605FC471C4020764a49F63C961A73";

	const handleRequestMint = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
		await requestMint2(data.get("gameID"), data.get("amount"), nowSelectedManager);
	}

	const handleRequestBurn = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
		await requestBurn(data.get("gameID"), data.get("amount"), nowSelectedManager);
	}

	const handleSelectByName = async (e) => {
		e.preventDefault();
    const data = new FormData(e.target);
		const gameName = data.get("tokens");
		if (gameName === "Meple story") {
			console.log(gameName);
			const name = await getTokenInfo(M);
			const symbol = await getTokenSymbol(M);
			const supply = await getTokenSupply(M);
			setTokenN(name);
			setTokenS(symbol);
			setTokenTS(supply);
			setNowSelectedManager(Mmanager);
			setNowSelectedCoin(M);
		}
		else if (gameName === "Tiablo") {
			console.log(gameName);
			const name = await getTokenInfo(T);
			const symbol = await getTokenSymbol(T);
			const supply = await getTokenSupply(T);
			setTokenN(name);
			setTokenS(symbol);
			setTokenTS(supply);
			setNowSelectedManager(Tmanager);
			setNowSelectedCoin(T);
		}
		else if (gameName === "Walcraft") {
			console.log(gameName);
			const name = await getTokenInfo(W);
			const symbol = await getTokenSymbol(W);
			const supply = await getTokenSupply(W);
			setTokenN(name);
			setTokenS(symbol);
			setTokenTS(supply);
			setNowSelectedManager(Wmanager);
			setNowSelectedCoin(W);
		}
		else if (gameName === "Erden ring") {
			console.log(gameName);
			const name = await getTokenInfo(E);
			const symbol = await getTokenSymbol(E);
			const supply = await getTokenSupply(E);
			setTokenN(name);
			setTokenS(symbol);
			setTokenTS(supply);
			setNowSelectedManager(Emanager);
			setNowSelectedCoin(E);
		}
		else if (gameName === "PIFA online") {
			console.log(gameName);
			const name = await getTokenInfo(P);
			const symbol = await getTokenSymbol(P);
			const supply = await getTokenSupply(P);
			setTokenN(name);
			setTokenS(symbol);
			setTokenTS(supply);
			setNowSelectedManager(Pmanager);
			setNowSelectedCoin(P);
		}
	}

	

	return (
		<div className="App">

			<div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
			<div>
          <div >
            <h1  className="text-xl font-semibold text-green-700 text-center">
              Select Token by Game name
            </h1>

            <form className="m-4" onSubmit={handleSelectByName}>
              <div>
							<label for="games" className="text-xl font-semibold text-green-700 text-center">Choose a game:</label>
  							<select type= "token" name="tokens" id="tokens" className="text-xl font-semibold text-red-700 text-center" placeholder='game'>
    							<option value="Meple story">Meple story</option>
    							<option value="Tiablo">Tiablo</option>
    							<option value="Walcraft">Walcraft</option>
									<option value="Erden ring">Erden ring</option>
    							<option value="PIFA online">PIFA online</option>
  							</select>
              </div>
    
              <footer>
                <button
								className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  type="submit"
                >
                  select
                </button>
              </footer>
            </form>
          </div>
        </div>
				</div>
			

				<div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
				<div className="px-4">
              <div className="overflow-x-auto">
							<h1  className="text-xl font-semibold text-green-700 text-center">
              Selected Token
            </h1>
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Symbol</th>
											<th>totalSupply</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{tokenN}</th>
                      <td>{tokenS}</td>
											<td>{tokenTS}</td>
                    </tr>
                  </tbody>
                </table>
								<table className="table w-full">
                  <thead>
                    <tr>
                      <th>tokenAddress</th>
                      <th>requestManagerAddress</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{nowSelectedCoin}</th>
                      <td>{nowSelectedManager}</td>
                    </tr>
                  </tbody>
                </table>
								<button className='text-xl font-semibold text-blue-700 text-center' onClick={() => window.open('https://ropsten.etherscan.io/address/'.concat(nowSelectedManager), '_blank')}>Check requestManager in block explorer</button>
              </div>
            </div>
						</div>

				

				<div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white margin:20" style={{ marginTop: `15px` }}>
			<div>
          <div >
            <h1  className="text-xl font-semibold text-green-700 text-center">
              Game Money to Token
            </h1>

            <form className="m-4" onSubmit={handleRequestMint}>
              <div>
                <input
                  type="text"
                  name="gameID"
                  placeholder="gameID"
									className="input input-bordered block w-full focus:ring"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount to Mint"
									className="input input-bordered block w-full focus:ring"
                />
              </div>
              <footer>
                <button
								className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  type="submit"
                >
                  submit
                </button>
              </footer>
            </form>
          </div>
        </div>
				</div>

				<div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
				<div>
          <div >
            <h1 className="text-xl font-semibold text-green-700 text-center">
              Token to Game Money
            </h1>

            <form className="m-4" onSubmit={handleRequestBurn}>
              <div>
                <input
                  type="text"
                  name="gameID"
                  placeholder="gameID"
									className="input input-bordered block w-full focus:ring"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount to Burn"
									className="input input-bordered block w-full focus:ring"
                />
              </div>
              <footer>
                <button
								className="btn btn-primary submit-button focus:ring focus:outline-none w-full"
                  type="submit"
                >
                  submit
                </button>
              </footer>
            </form>
          </div>
        </div>
				</div>

			

		</div>
	);
}

export default App;
