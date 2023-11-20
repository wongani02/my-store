import { FunctionComponent } from "react";
import BillBoardClient from "./components/client";

interface BillBoardPageProps {
    
}
 
const BillBoardPage: FunctionComponent<BillBoardPageProps> = () => {
    return ( 
        <div className="flex-col ">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillBoardClient/>
            </div>
        </div>
    );
}
 
export default BillBoardPage;