import { useState, useEffect } from 'react'
import type { FormEvent } from 'react';
import styles from './home.module.css'
import { BsSearch } from 'react-icons/bs'
import { Link, useNavigate } from 'react-router-dom'

export interface CoinProps{
  id: string;
  name: string;
  symbol: string;
  priceUsd: string;
  vwap24Hr: string;
  changePercent24Hr: string;
  rank: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr:string;
  explorer: string;
  formatedPrice?: string;
  formatedMarket?: string;
  formatedVolume?: string;
}

interface DataProp{
  data: CoinProps[]
}

export function Home(){
    const [input, setInput] = useState("")
    const [coins, setCoins] = useState<CoinProps[]>([]);
    const [offset, setOffset] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getData();
    }, [offset])

    async function getData(){
        fetch(`https://rest.coincap.io/v3/assets?limit=10&offset=${offset}&apiKey=0d71954a248e5d361292e1c9d14601e398e234847247b48b43f357e03603f250`)
        .then(response => response.json())
        .then((data: DataProp) => {
            const coinsData = data.data;

            const price = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      })

      const priceCompact = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact"
      })
    
      const formatedResult = coinsData.map((item) => {
        const formated = {
          ...item,
          formatedPrice: price.format(Number(item.priceUsd)),
          formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
          formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr))
        }

        return formated;
      })

      //console.log(formatedResult);

      const listCoins = [...coins, ... formatedResult]

      setCoins(listCoins);
    })
}
  

    function handleSubmit(e: FormEvent){
        e.preventDefault();

        if(input === "") return;
        navigate(`detail/${input.toLowerCase()}`)
    }
 
    function handleLoadMore(){
        if(offset === 0){
            setOffset(10)
            return;
        }

        setOffset(offset + 10)
    }

    return(
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Search for a coin..."
                  value={input}
                  onChange={ (e) => setInput(e.target.value) }
                />
                <button type="submit">
                    <BsSearch size={30} color="#FFF"/>
                </button>
            </form>

        <table>
            <thead>
                <tr>
                    <th scope="col">Coin</th>
                    <th scope="col">Market Cap</th>
                    <th scope="col">Price</th>
                    <th scope="col">Volume(24Hr)</th>
                    <th scope="col">Change(24Hr)</th>

                </tr>
            </thead>
            <tbody id="tbody">
               
               {coins.length > 0 && coins.map((item) => (
                 <tr className={styles.tr} key={item.id}>
                    <td className={styles.tdLabel} data-Label="Coin">
                        <div className={styles.name}>
                            <img
                                className={styles.logo}
                                alt="Logo Cripto"
                                src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}
                            />
                          <Link to={`/detail/${item.id}`}>
                             <span>{item.name}</span> | {item.symbol}
                          </Link>
                        </div>
                    </td>

                    <td className={styles.tdLabel} data-Label="Market Cap">
                        {item.formatedMarket}
                    </td>

                    <td className={styles.tdLabel} data-Label="Price">
                        {item.formatedPrice}
                    </td>

                    <td className={styles.tdLabel} data-Label="Volume(24Hr)">
                        {item.formatedVolume}
                    </td>

                    <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-Label="Change(24Hr)">
                        <span>{Number(item.changePercent24Hr).toFixed(3)}</span>
                    </td>
                    
                </tr>
               ))}
            </tbody>
        </table>

        <button className={styles.buttonMore} onClick={handleLoadMore}>
            Load more
        </button>

        </main>
    )
}