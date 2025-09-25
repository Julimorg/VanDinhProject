import Header from '@/Components/Header/Header';
import type { FC } from "react"
import MomoGeneral from './Components/MomoGeneral';



const MomoPage: FC = () => {
    return (
        <>
            <div className="p-6">
                 <Header />
                 <div className="flex items-center justify-center w-full h-16">
                   <h1 className="text-2xl font-bold text-center text-gray-800">Quản lý Momo</h1>
                 </div>
                 <MomoGeneral/>
               </div>
        </>
    )
}

export default MomoPage;