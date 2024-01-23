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
                    <h4 className="dashboard-heading">D3 Visualization | Milestones</h4>
                    <svg className="dashboard-svg" id="diagram" ref={svgRef}>
                        `<Draw dataset={dataset} svgRef={svgRef}/>
                    </svg>
                    <body ref={bodyRef}></body>
                </div>
            )
            :
            (<div>Loading...</div>)
        }
        </>
    );
}

export default Dashboard;