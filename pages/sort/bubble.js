import PageTitle from '@/components/PageTitle'
import DataBar from '@/components/sort/DataBar';
import SortButtons from '@/components/sort/SortButtons'
import { useEffect, useState } from 'react'

export default function bubble() {
    const [values,setValues]=useState([]);
    const [resetState,setResetState]=useState([]);
    function sortValues(){
        let sorted=values.slice().sort((a,b)=>a-b);
        setValues(sorted);
    }
    function resetValues(){
        setValues(resetState);
    }
    function fillRandomValues(){
        setValues(Array.from({length:15},()=>Math.floor(Math.random() * 650)));
        setResetState(values);
    }
    useEffect(()=>{
        fillRandomValues();
        setResetState(values);
    },[]);
    return (
      <>
        <div className="mt-4 text-center">
          <PageTitle>Bubble Sort</PageTitle>
          <div className="w-full h-auto flex flex-row justify-around items-end">
            {values&& (values.map((v,idx)=>{
              return(
                <DataBar key={idx} value={v} width={`${(100/values.length)-2}%`} showValue={false}></DataBar>
              )
            }))}
          </div>
          <SortButtons callSort={sortValues} resetValues={resetValues} fillNewValues={fillRandomValues}></SortButtons>
        </div>
      </>
    )
  }