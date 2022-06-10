import React, { useState } from 'react';

import { getOwnBalance, requestMint, requestMint2, requestBurn, read } from './Web3Client';


function App() {
	const [requested, setRequsted] = useState(false);
	const [balance, setBalance] = useState(0);
	const [bookmark0, setBookmark0] = useState(0);
	const [bookmark1, setBookmark1] = useState([]);
	const [bookmark2, setBookmark2] = useState([]);
	const [bookmark3, setBookmark3] = useState([]);
	const [contractInfo, setContractInfo] = useState({
    nextAccept: [],
    IDs: [],
    amounts: [],
    isAccepted: []
  });

	const handleRequestMint = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
		await requestMint2(data.get("gameID"), data.get("amount"));
	}

	const handleRequestBurn = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
		await requestBurn(data.get("gameID"), data.get("amount"));
	}

	const handleRead = async (e) => {
		e.preventDefault();
		const data = await read();
		console.log(data[0]);
		setBookmark0(bookmark0 => data[0]);
		setBookmark1(bookmark1 => data[1]);
		setBookmark2(bookmark2 => data[2]);
		setBookmark3(bookmark3 => data[3]);
	}

	const fetchBalance = () => {
		getOwnBalance()
			.then((balance) => {
				setBalance(balance);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div className="App">
			
			<div>
          <div >
            <h1>
              RequestMint
            </h1>

            <form onSubmit={handleRequestMint}>
              <div>
                <input
                  type="text"
                  name="gameID"
                  placeholder="gameID"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount to Mint"
                />
              </div>
              <footer>
                <button
                  type="submit"
                >
                  submit
                </button>
              </footer>
            </form>
          </div>
        </div>

				<div>
          <div >
            <h1>
              RequestBurn
            </h1>

            <form onSubmit={handleRequestBurn}>
              <div>
                <input
                  type="text"
                  name="gameID"
                  placeholder="gameID"
                />
              </div>
              <div>
                <input
                  type="text"
                  name="amount"
                  placeholder="Amount to Burn"
                />
              </div>
              <footer>
                <button
                  type="submit"
                >
                  submit
                </button>
              </footer>
            </form>
          </div>
        </div>

				<div>
          <div >
            <h1>
              Read
            </h1>

            <form onSubmit={handleRead}>
              
              <footer>
                <button
                  type="submit"
                >
                  read
                </button>
              </footer>

            </form>

						<div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>nextAccept</th>
                      <th>IDs</th>
											<th>amounts</th>
                      <th>isAccepted</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>{bookmark0}</th>
                      <td>{bookmark1}</td>
											<td>{bookmark2}</td>
											<td>{bookmark3}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

          </div>
        </div>

				

		</div>
	);
}

export default App;
