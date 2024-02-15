import './Dashboard.css';
import { useRef, useEffect, useState } from "react";
import Draw from './Draw.js';

function Dashboard(){
    const svgRef = useRef(null);
    const bodyRef = useRef(null);
    const [dataset, setDataset] = useState(null);
    useEffect(() => {
        import('./data.json').then((data)=>{
            setDataset(data.default);
        });
    }, []);
    return (<>
       {dataset != null ? (
                <div className="dashboard">
                    <h4 className="dashboard-heading">D3 Visualization | TAT</h4>
                    <div className="keys-container">
                        <div className="circle-key-container">
                            <label className="circle-key">Global Medical:</label>
                            <svg width="30px" height="30px">
                                <circle className="=circle-key" r="12" fill="white" cx="15" cy="15"></circle>
                            </svg>
                        </div>
                        <div className="circle-key-container">
                            <label className="circle-key">Regional/Local:</label>
                           <svg width="30px" height="30px">
                                <circle className="circle-key" r="12" fill="rgb(128 128 128)" cx="15" cy="15"></circle>
                           </svg>
                        </div>
                    </div>
                    <svg className="dashboard-svg" id="diagram" ref={svgRef}>
                        `<Draw dataset={dataset} svgRef={svgRef}/>
                    </svg>
                    <div id='dashboard-table'></div>
                </div>
            )
            :
            (<div>Loading...</div>)
        }
        </>
    );
}

export default Dashboard;