import ButtonTextOnly from '@/Components/ButtonTextOnly/ButtonTextOnly';
import TextBigTitle from '@/Components/TextBigTitle/TextBigTitle';
import type React from 'react';
import TextField from '@/Components/TextField/TextFieldText';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// import Keyboard from 'react-simple-keyboard';
import { useSearchTicket } from './Hook/useSearchTicket';
import { ReqSearchTicket } from '@/Interface/TSearchTicket';
import { DataContainer } from './Components/DataContainer';
import Loading from '@/Components/Loading';
// import 'react-simple-keyboard/build/css/index.css';

const FindTicket: React.FC = () => {

  const location = useLocation();
  const navigate = useNavigate();

  const [isSearched, setIsSearched] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [error, setIsError] = useState(false);
  // const [showKeyboard, setShowKeyboard] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutate, data } = useSearchTicket();


  const handleSearch = () => {
    if (searchValue.trim() === '') {
      setIsError(true);
    } else {
      setIsError(false);
      setIsSearched(true);
      setIsLoading(true);
      const isEmail = searchValue.includes('@');
      const searchPayload: ReqSearchTicket = isEmail
        ? { customer_email: searchValue }
        : { customer_phone_number: searchValue };

      mutate(searchPayload, {
        onSuccess: (response) => {
          setIsLoading(false);
          console.log('API Response:', response);
        },
        onError: (error) => {
          setIsLoading(false);
          console.error('Search Error:', error);
        },
      });
      navigate("/find-ticket");
    }
  };
  // const handleFocus = () => {
  //   setShowKeyboard(true);
  // };
  // const handleKeyboardChange = (input: string) => {
  //   setSearchValue(input);
  // };

  return (
    <>
      {/* <Navbar /> */}
      <div className="find-ticket-container  ml-[2rem] mt-[1rem] ">
        {(isLoading || isLoading) && <Loading />}
        <TextBigTitle $fontSize="30px" title="Tìm kiếm vé" />

        {/* Search Modal */}
        <div className="search-container flex gap-[5em] border-b-[1px] border-solid border-[#333333]/20 pb-[1rem] mr-[2rem]">
          <TextField
            title={
              error ? 'Vui lòng không bỏ trống thông tin' : 'Nhập email khách hàng hoặc số điện thoại'
            }
            width="50rem"
            height="4rem"
            fontSize="20px"
            border={error ? '1px solid red' : '1px solid #d9d9d9'}
            placeholderColor={error ? '#CD5C5C' : '#d9d9d9'}
            value={searchValue}
            // onFocus={handleFocus}
            onChange={(e) => setSearchValue(e.target.value)}
            // onBlur={() => setShowKeyboard(false)}
          />
          <ButtonTextOnly
            title="Tìm kiếm"
            $fontSize="20px"
            $color="#fff"
            $backgroundColor="#29A36A"
            $hoverBackgroundColor="#185F3E"
            $height="3em"
            $width="10em"
            onClick={handleSearch}
          />
        </div>

        {/* Table Data Modal */}
        <div className="display-data-container mt-[2rem] ">
          {location.pathname.includes('/detail-ticket') ? (
            <Outlet /> // Ưu tiên render Outlet nếu URL chứa /detail-ticket
          ) : isSearched ? (
            <DataContainer data={data ?? undefined} isLoading={false} />
          ) : (
            <TextBigTitle
              $fontSize="30px"
              $color="#d9d9d9"
              $fontWeight="300"
              $textalign="center"
              title="Vui lòng nhập thông tin tìm kiếm"
            />
          )}
          {/* {showKeyboard && <Keyboard onChange={handleKeyboardChange} />} */}
        </div>
      </div>
    </>
  );
};
export default FindTicket;
