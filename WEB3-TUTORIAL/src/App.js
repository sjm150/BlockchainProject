import React, { useState } from 'react';
import Web3 from 'web3';
import { getOwnBalance, requestMint, requestMint2, requestBurn, read, getTokenInfo, getTokenSymbol, getTokenSupply } from './Web3Client';

function App() {
	const [requested, setRequsted] = useState(false);
	const [balance, setBalance] = useState(0);
	const [tokenN, setTokenN] = useState("-");
	const [tokenS, setTokenS] = useState("-");
	const [tokenTS, setTokenTS] = useState("-");
	const [nowSelectedCoin, setNowSelectedCoin] = useState("-");
	const [nowSelectedManager, setNowSelectedManager] = useState("-");
	const M = "0x082e17A998317728c9cd8c2f5424E024b80eD6a6";
	const T = "0xa025d99E5188e378b0b41244F0783DD2a3d48067";
	const W = "0x8969817E4b630E8DF94982e4138B1291523456CE";
	const E = "0xEd5C29707eC5b374a1544B5EFbcd923291991898";
	const P = "0x3784bC66c0e84976661418E8C42Fc98980Eb1ebA";
	const Mmanager ="0x6d79791da87F7d014ae61afeFF833A3D06B89820";
	const Tmanager ="0x2451F945BA4cAf4570D0958d815a6Af3a2E1a9c4";
	const Wmanager ="0xd03f4C997cF4Bd0c083b81D3BF8B48088FD278f9";
	const Emanager ="0xcd79904633516513A541D5Ce2c3984907AAE81eD";
	const Pmanager ="0xc245D446Dff9407322638F444f23769991603939";


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


	const handleSelect = async (e) => {
		e.preventDefault();
    const data = new FormData(e.target);
		const name = await getTokenInfo(data.get("tokenAddress"));
		const symbol = await getTokenSymbol(data.get("tokenAddress"));
		const supply = await getTokenSupply(data.get("tokenAddress"));
		setTokenN(name);
		setTokenS(symbol);
		setTokenTS(supply);
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
			<div>
          <div >
            <h1  className="text-xl font-semibold text-green-700 text-center">
              Select Token by Address
            </h1>

            <form className="m-4" onSubmit={handleSelect}>
              <div>
                <input
                  type="text"
                  name="tokenAddress"
                  placeholder="tokenAddress"
									className="input input-bordered block w-full focus:ring"
                />
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
              </div>
            </div>
						</div>


				<div className="credit-card w-full lg:w-3/4 sm:w-auto shadow-lg mx-auto rounded-xl bg-white">
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
