import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import './iblist.css';

// 상세 정보 페이지 컴포넌트
const Iblist = () => {
  const navigate = useNavigate();
  const [farms, setFarms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // PC는 5 설정
  const pageCount = 5;

  // 화면 크기에 따라 pageSize 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setPageSize(11); // 모바일은 11 설정
      } else {
        setPageSize(5); // 그 외에는 5 설정
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 컴포넌트가 마운트될 때 농지 리스트를 가져오는 useEffect 훅
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      fetch('http://3.39.228.42:8080/farms/iblist/', { 
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        }, 
      })
      .then(response => {
        console.log(response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error();
        }
      })
      .then(data => {
        console.log('data:', data.results);
        setFarms(data.results.reverse());
        //currentFarmId에 맞는 페이지 설정
        const currentFarmId = localStorage.getItem('currentFarmId');
        if (currentFarmId) {
          const index = data.results.findIndex(farm => farm.farm_id.toString() === currentFarmId);
          if (index !== -1) {
            const page = Math.ceil((index + 1) / pageSize);
            setCurrentPage(page);
            localStorage.removeItem('currentFarmId');
          }
        }
      })
      // 로컬 스토리지에만 토큰이 남아있어도 로그인 페이지로 유도 가능
      .catch(error => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [navigate, pageSize]);

  // farms 상태가 업데이트될 때마다 현재 상태를 출력
  useEffect(() => {
    console.log('farms:', farms);
  }, [farms]);

  // 현재 페이지에 맞는 농지 리스트를 반환
  const lastIndex = currentPage * pageSize;
  const firstIndex = lastIndex - pageSize;
  const currentItems = farms.slice(firstIndex, lastIndex);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(farms.length / pageSize);

  // 표시할 페이지 범위 계산
  const startPage = Math.floor((currentPage - 1) / pageCount) * pageCount + 1;
  const endPage = Math.min(startPage + pageCount - 1, totalPages);

  // 페이지 변경 핸들러
  const changePage = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // 페이지네이션 버튼 렌더링 함수
  const Pagination = (page, symbol, isDisabled) => (
    <button onClick={() => changePage(page)} disabled={isDisabled}>
      {symbol}
    </button>
  );

  // 농지 선택 시 해당 farm_id localStorage에 저장
  const handleFarmDetail = (farmId) => {
    localStorage.setItem('selectedFarmId', farmId);
    navigate(`/ibdetail/${farmId}`);
  };

  return (
    <div className="page">
      <Navbar />
      <div className='listpage'>
        <div className="lists-container">
          <div className="title">불법 건축물 리스트</div>

          <div className='lists-info'>
            {currentItems.length > 0 ? (
              currentItems.map((farm, index) => (
                <div className='lists' key={index}>
                  <div className='farm-info'>
                    <div className='num'>{farms.length - (firstIndex + index)}.</div>
                    <div className='farm-name'>[{farm.farm_name}]</div>
                    <div className='farm-owner'>지목: {farm.farm_owner}</div>
                    <div className='farm-size'>농지 크기: {farm.farm_size}</div>

                    <button onClick={() => handleFarmDetail(farm.farm_id)} className="choiceBtn">선택</button>
                  </div>
                </div>
              ))
            ) : (
              <div className='noelemnt'>게시된 불법 건물이 없습니다.</div>
            )}
          </div>

          <div className='pagination-container'>
            <div className="pagination">
              {Pagination(1, "<<", currentPage === 1)}
              {Pagination(currentPage - 1, "<", currentPage === 1)}
              {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(number => (
                <button 
                  key={number} 
                  onClick={() => changePage(number)} 
                  className={number === currentPage ? 'active' : ''}
                >
                  {number}
                </button>
              ))}
              {Pagination(currentPage + 1, ">", currentPage === totalPages)}
              {Pagination(totalPages, ">>", currentPage === totalPages)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Iblist;
