import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import './modal_admin.css';

// 상세 정보 페이지
const DetailModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="adminModal">
      <div className="adminModal-content">
        <button className="adminModal-Btn" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

DetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};


export default DetailModal;
