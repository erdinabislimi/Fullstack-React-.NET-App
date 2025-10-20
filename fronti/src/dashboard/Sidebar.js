import React from "react";
import { Link } from "react-router-dom";
import {
  BsGrid1X2Fill,
  BsPeopleFill,
  BsBookFill,
} from "react-icons/bs";
import { FiHome } from "react-icons/fi";

function Sidebar({
  openSidebarToggle,
  OpenSidebar,
  handleCustomersClick,
  handleLibriClick,
  handleAutoriClick,
  handleQytetiClick,
  handleZhanriClick,
  handleEventsClick,
  handleShtepiaClick,
  handleExchangeListClick,
  handleExchangeApproveClick,
  handePaymentClick,
}) {
  return (
    <aside
      id="sidebar"
      className={openSidebarToggle ? "sidebar-responsive" : ""}
    >
      {/* Sidebar Header */}
      <div className="sidebar-title">
        <div className="sidebar-brand">
          <Link to="/Home" className="sidebar-link">
            <FiHome className="icon_header" />
            <span>Home</span>
          </Link>
        </div>
      </div>

      {/* Sidebar List */}
      <ul className="sidebar-list">
        <li className="sidebar-list-item">
          <Link to="/Dashboard" className="sidebar-link">
            <BsGrid1X2Fill className="icon" /> Dashboard
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/libri" className="sidebar-link" onClick={handleLibriClick}>
            <BsBookFill className="icon" /> Books
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link
            to="/Autori"
            className="sidebar-link"
            onClick={handleAutoriClick}
          >
            <BsBookFill className="icon" /> Autori
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link
            to="/klienti"
            className="sidebar-link"
            onClick={handleCustomersClick}
          >
            <BsPeopleFill className="icon" /> Customers
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/qyteti" className="sidebar-link" onClick={handleQytetiClick}>
            <BsBookFill className="icon" /> Qyteti
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/zhanri" className="sidebar-link" onClick={handleZhanriClick}>
            <BsBookFill className="icon" /> Zhanri
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link to="/events" className="sidebar-link" onClick={handleEventsClick}>
            <BsBookFill className="icon" /> Events
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link
            to="/ShtepiaBotuese"
            className="sidebar-link"
            onClick={handleShtepiaClick}
          >
            <BsBookFill className="icon" /> Shtepia Botuese
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link
            to="/ExchangeList"
            className="sidebar-link"
            onClick={handleExchangeListClick}
          >
            <BsBookFill className="icon" /> Exchange List
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link
            to="/PendingApproval"
            className="sidebar-link"
            onClick={handleExchangeListClick}
          >
            <BsBookFill className="icon" /> Not Approved after 24 Hours
          </Link>
        </li>

        <li className="sidebar-list-item">
          <Link
            to="/ExchangeApprove"
            className="sidebar-link"
            onClick={handleExchangeApproveClick}
          >
            <BsBookFill className="icon" /> Exchange Approve
          </Link>
        </li>
        <li className="sidebar-list-item">
          <Link
            to="/Payments"
            className="sidebar-link"
            onClick={handePaymentClick}
          >
            <BsBookFill className="icon" /> Payments
          </Link>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;
