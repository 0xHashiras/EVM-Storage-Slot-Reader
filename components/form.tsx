import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { useState } from "react";
import {QueryStruct} from "./interface"
import React from 'react';

let id = 0;
const Form = () => {
  const[ContractAddress,setContractAddress] = useState("");
  const [QueryList,setQueryList] = useState<QueryStruct[] >([
]);

const UpdateContractAddress =(event:any)=>{
    setContractAddress(event.target.value);
  }
  const form: any = document.querySelector('#QueringFrom');
  form.onsubmit = () => {
    const formData = new FormData(form);
  
    const variableType = formData.get('vars') as string;
    const SlotNumber = formData.get('SlotNumber') as string;
    ++id;
    setQueryList ((prevList) =>   {
      prevList.push({variableType:variableType ,slotNumber:SlotNumber,id:id});
      console.log(QueryList);
      return prevList
    })
    return false; // prevent reload
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>EVM storage slot reader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div>
        Contract Address
        <input name= "Contract Address" id= "ContractAddress" type="text" value= {ContractAddress} onChange={UpdateContractAddress}  />
        <div>
          Contract Address :{ContractAddress}
        </div>
        </div>
        <div>
        <form id='QueringFrom'>
        <fieldset>
          <label htmlFor="Variable">Variable Type:</label>
          <select  name="vars">
            <option value= "uint256">uint256</option>
            <option value= "string">string</option>
            <option value= "bytes">bytes</option>
            <option value= "uin256[]">uin256[]</option>
          </select>
          <label htmlFor="Slot number">Slot number:</label>
          <input name= "SlotNumber" type="string"  />
          </fieldset>
          <button > add </button>
          <input type="submit"/>
        </form>
        </div>
        <div>
          Querys to fetch :          
          {QueryList.map((Query,index)=>(
            <div key={index} >
              <> 
             Storage Slot Number {Query.slotNumber? Query.slotNumber :0} ----- Varibale Type {Query.variableType? Query.variableType : "null"}  
              </>
            </div>
          ))}
        </div>
        
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  );
};

export default Form;
