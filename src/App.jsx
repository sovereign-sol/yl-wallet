import { createWeb3Modal, defaultSolanaConfig } from '@web3modal/solana/react';
import { solana, } from '@web3modal/solana/chains'
import Staking from './Staking/Staking';
import logo from './assets/logo.svg';
import { Bounce, toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import { projectId } from './Staking/helper';


const chains = [solana]

const metadata = {
  name: 'Yontalabs',
  description: 'Yonta Labs Validator',
  url: 'https://www.yontalabs.io/',
  icons: ['./assets/logo.svg']
}

const solanaConfig = defaultSolanaConfig({
  metadata,
  chains,
  projectId
})

createWeb3Modal({
  solanaConfig,
  chains,
  projectId,
  themeVariables: {
    '--w3m-color-mix': '#404E80',
    '--w3m-color-mix-strength': 40,
    '--w3m-accent': '#FF6300',
  },
  featuredWalletIds: [
    'a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393',
    '1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79',
    '2bd8c14e035c2d48f184aaa168559e86b0e3433228d3c4075900a221785019b0',
  ],
  coinbasePreference: 'smartWalletOnly'
})

const toastMessage = (message, type) => {
  toast[type](message, {
    position: "bottom-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  });
}



export default function App() {
  return (
    <>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover
        theme="dark"
        transition:Bounce
      />
      <div className='bg-[#5567a9]'>
        <nav className='container mx-auto p-5 flex justify-between items-center'>
          <img className='w-12' src={logo} alt={logo} />
          <w3m-button />
        </nav>
      </div>
      <Staking toastMessage={toastMessage} />
    </>
  )
}