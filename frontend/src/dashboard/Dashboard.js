import './Dashboard.css';
import * as Toolbox from './toolbox.js';
import { useRef, useEffect, useState } from "react";
import Draw from './Draw.js';

function Dashboard(){
    const svgRef = useRef(null);
    const bodyRef = useRef(null);
    const [selectionST, setSelectionST] = useState("(all)");
    const [selectionTA, setSelectionTA] = useState("(all)");
    const [listST, setListST] = useState([]);
    const [listTA, setListTA] = useState([]);
    const [dataset, setDataset] = useState(null);
    const [showStDropdown, setShowStDropdown] = useState(false);
    const [showTaDropdown, setShowTaDropdown] = useState(false);


    useEffect(() => {
        import('./data.json').then((data)=>{
            setDataset(data.default);
        });
    }, []);
    useEffect(()=>{
        if(dataset !== null){
            const STSet = Toolbox.createOptionList(dataset, "Study Type");
            const TASet = Toolbox.createOptionList(dataset, "TA");
            setListST([...STSet]);
            setListTA([...TASet])
        }
    }, [dataset]);

    useEffect(()=>{

    }, [selectionST, selectionTA]);

    const updateLists = () => {

    }

    const handleTaDropdownToggle = () => {
        setShowTaDropdown(!showTaDropdown);
    }

    const handleStDropdownToggle = () => {
        setShowStDropdown(!showStDropdown);
    }

    const handleTaDropdownSelection = (value) => {
        setShowTaDropdown(!showTaDropdown);
        setSelectionTA(value);
    }

    const handleStDropdownSelection = (value) => {
        setShowStDropdown(!showStDropdown);
        setSelectionST(value);
    }

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
                    <div className="dashboard-dropdown-layout">
                        <div className="dashboard-dropdown-box">
                            <span className="dropdown-label label">Study Type: </span><div className="dashboard-dropdown-button" onClick={handleStDropdownToggle}><span>{selectionST}</span></div>
                            <ul className={`dashboard-dropdown ${showStDropdown ? 'show' : ''}`}>
                                <li className="dashboard-dropdown-item" key="all" onClick={()=>handleStDropdownSelection('(all)')}>(all)</li>
                                {listST.map((item) => (
                                    <li className="dashboard-dropdown-item" key={item} onClick={()=>handleStDropdownSelection(item)}>{item}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="dashboard-dropdown-box">
                            <span className="dropdown-label label">TA: </span><div className="dashboard-dropdown-button" onClick={handleTaDropdownToggle}><span>{selectionTA}</span></div>
                            <ul className={`dashboard-dropdown ${showTaDropdown ? 'show' : ''}`}>
                                <li className="dashboard-dropdown-item" key="all" onClick={()=>handleTaDropdownSelection('(all)')}>(all)</li>
                                {listTA.map((item) => (
                                     <li className="dashboard-dropdown-item" key={item} onClick={() => handleTaDropdownSelection(item)}>{item}</li>
                                ))}
                            </ul>
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