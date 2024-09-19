import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWeb3Modal, useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/solana/react'
import { getInitCreateDelegateTX } from './helper'
import fullNameLogo from '../assets/fullNameLogo.svg'
import logo from '../assets/logo.svg'
import { useState , useEffect } from 'react';

const Staking = ({ toastMessage }) => {
  const { open } = useWeb3Modal();
  const { walletProvider, connection } = useWeb3ModalProvider();
  const { isConnected , address } = useWeb3ModalAccount();
  const [amount, setamount] = useState('0');
  const [balance, setBalance] = useState(null);
  const [solToStake, setSolToStake] = useState('0')
  const fee = 0.001;

  const onSendClick = async () => {
    if (walletProvider?.publicKey && walletProvider?.signTransaction) {
      try {
        const { createTX, stakeAccount } = await getInitCreateDelegateTX({
          connection,
          ownerPubkey: walletProvider.publicKey,
          totalSol: solToStake
        });

        createTX.feePayer = walletProvider.publicKey;

        const simulationResult = await connection.simulateTransaction(createTX);
        // console.log('Simulation result:', simulationResult);
        toastMessage('Transaction initializing...' , 'info');

        if (!simulationResult.value.err) {
          const sig = await walletProvider.sendTransaction(createTX, connection, {
            signers: [stakeAccount],
          });
          console.log('sig', sig);
          toastMessage(sig , 'info');
          const success = await connection.confirmTransaction(sig);
          toastMessage(success , 'success');
        } else {
          toastMessage('You Have '+balance+' SOL balance' , 'error');
          if (balance <= solToStake)
            toastMessage('Transaction not possible: You requested ' + solToStake + ' SOL to stake, but you only have ' + balance + ' SOL','error');
          else
          toastMessage('Ops! Something went wrong. Please check balance and/or permissions','error')
        }
      } catch (e) {
        toastMessage(e.message , 'error')
      }
    }
    else {
      open()
    }
  };

  useEffect(() => {
    setamount(() => amount)
  const _amount = parseFloat(amount) + fee;
    if (balance > 0) {
      if (_amount > balance) {
        amount == balance && toastMessage('Transaction not possible: You requested to stake '+amount+' SOL, which, together with the fee, exceeds your balance of '+balance+' SOL.','error');
        amount > balance && toastMessage('Transaction not possible: You requested to stake '+amount+' SOL, which, exceeds your balance of '+balance+' SOL.','error');
      } else {
        setSolToStake(() => parseFloat(amount))
      }
    } 
  }, [amount, balance])

  
  useEffect(() => {
    if (balance > 0) {
      const solToStakeValue = balance - fee;
      setSolToStake(parseFloat(solToStakeValue.toFixed(4)));
      setamount(parseFloat(solToStakeValue.toFixed(4)));
    }else{
      setamount(0)
      setSolToStake(0);
    }
  }, [balance,address])

  useEffect(() => {
    const fetchBalance = async () => {
      if (isConnected && walletProvider.publicKey) {
        const bal = await connection.getBalance(walletProvider.publicKey);
        const solBalance = bal / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      }else{
        setamount(0)
        setSolToStake(0)
      }
    };

    fetchBalance();
  }, [isConnected,address , balance, walletProvider?.publicKey, connection]);

  return (
    <>
      <div className='w-fit p-10 rounded-lg bg-[#fff] mx-auto mt-20'>
        <img className='mb-5 mx-auto' src={fullNameLogo} alt="fullNameLogo" />
        <div className='border-[#FF6300] border-2'>
          <input onChange={(e) => setamount(()=>parseFloat(e.target.value))} value={amount} className='outline-none py-1 px-2 text-lg w-full' type="number" min={0} name="amount" placeholder='0' />
          <button onClick={() => setamount(() => parseFloat(balance - fee))} className='w-full px-2 bg-[#FF6300] transition-all hover:opacity-80 text-white'>Maximum Amount</button>
        </div>
        <button  className={`text-[#0047AB] border-[#0047AB] hover:scale-10 hover:text-[#FF6300] hover:border-[#FF6300] border-2 p-2 w-full mt-5 font-semibold transition-all flex justify-center items-center `} onClick={onSendClick}>Stake with <img className='w-8 ml-3' src={logo} alt={logo} /></button>
      </div>
    </>
  )
}

export default Staking