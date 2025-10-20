import React, { useState } from "react";
import "./dashb.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Main from "./Main";
import Klienti from "./Klienti";
import Libri from "./Libri";
import Autori from "./Autori";
import Qyteti from "./Qyteti";
import zhanri from "./zhanri";
import ShtepiaBotuese from "./ShtepiaBotuese";
import Events from "./Events";
import Payments from "./Payments";


function Dashboard() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);
  const [showKlienti, setShowKlienti] = useState(false);
  const [showLibri, setShowLibri] = useState(false); 
  const [showAutori, setShowAutori] = useState(false); 
  const [showQyteti, setShowQyteti] = useState(false); 
  const [showZhanri, setShowZhanri] = useState(false); 
  const [showEvents, setShowEvents] = useState(false); 
  const [showShtepia, setShowShtepia] = useState(false); 
  const [showPayments,setShowPayments]=useState(false);
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  const handleCustomersClick = () => {
    setShowKlienti(true);
    setShowLibri(false); 
  };

  const handleLibriClick = () => {
    setShowLibri(true);
    setShowKlienti(false);
  };
  const handleAutoriClick = () => {
    setShowLibri(false);
    setShowKlienti(false); 
    setShowAutori(true);
    
  };


  const handleQytetiClick = () => {
    setShowLibri(false);
    setShowKlienti(false); 
    setShowAutori(false);
    setShowQyteti(true);
    
  };
  const handleZhanriClick = () => {
    setShowLibri(false);
    setShowKlienti(false); 
    setShowAutori(false);
    setShowQyteti(false);
    setShowZhanri(true);
    
  };
  const handleShtepiaClick = () => {
    setShowLibri(false);
    setShowKlienti(false);
    setShowAutori(false);
    setShowQyteti(false);
    setShowZhanri(false);
    setShowShtepia(true);
    
  };
  const handleEventsClick = () => {
    setShowLibri(false);
    setShowKlienti(false); 
    setShowAutori(false);
    setShowQyteti(false);
    setShowZhanri(false);
    setShowShtepia(false);
    setShowEvents(true);
    
  };
  const handePaymentClick = () => {
    setShowLibri(false);
    setShowKlienti(false); 
    setShowAutori(false);
    setShowQyteti(false);
    setShowZhanri(false);
    setShowShtepia(false);
    setShowEvents(false);
    setShowPayments(true);
    
  };
  return (
    <div className="grid-container">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
        handleCustomersClick={handleCustomersClick} 
        handleLibriClick={handleLibriClick} 
        handleAutoriClick={handleAutoriClick}
        handleQytetiClick={handleQytetiClick}
        handleZhanriClick={handleZhanriClick}
        handleShtepiaClick={handleShtepiaClick}
        handleEventsClick={handleEventsClick}
        handePaymentClick={handePaymentClick}
      />
      <Main />
     
      {showKlienti && <Klienti />}
      
      {showLibri && <Libri />}
      {showAutori && <Autori />}
      {showQyteti && <Qyteti/>}
      {showZhanri && <zhanri/>}
      {showShtepia && <Shtepia/>}
      {showEvents && <Events/>}
      {showPayments && <Payments/>}
    </div>
  );
}

export default Dashboard;
