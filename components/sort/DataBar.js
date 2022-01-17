export default function DataBar({value,width,showValue}){
    return(
        <div style={{height:`${value}px`,width:width}} className="bg-gray-700 dark:bg-white dark:text-black text-primary-300 overflow-hidden" >{parseInt(width)>3&&showValue&&value}</div>   
    )
}