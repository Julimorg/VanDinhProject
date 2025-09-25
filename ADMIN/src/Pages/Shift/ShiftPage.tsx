// ShiftPage.tsx
import Navbar from '@/Components/Header';
import TextBigTitle from '@/Components/TextBigTitle/TextBigTitle';
import type React from 'react';
import DataAfterShift from './Component/DataAfterShift';
import ButtonTextOnly from '@/Components/ButtonTextOnly/ButtonTextOnly';

import ModalBox from '@/Components/ModalBox/ModalBox';
import { useState } from 'react';
import { useShiftStore } from '@/Hook/LocalUseContext/CrashierShift/ShiftProvider';
import { useAuthStore } from '@/Store/auth';
import { useOnShift } from './Hook/useOnShift';
import { useOffShift } from './Hook/useOffShift';
import type { OnShift, OffShift } from '@/Interface/TShift';
import { toast } from 'react-toastify';
import { formatToVietnamTime, getFormattedTime } from '@/Utils';
import Loading from '@/Components/Loading';
import { isAxiosError } from 'axios';

const ShiftPage: React.FC = () => {
  const {
    timeOnShift,
    setTimeOnShift,
    timeOffShift,
    setTimeOffShift,
    checkOnShift,
    setCheckOnShift,
    checkOffShift,
    setCheckOffShift,
    transactions,
    setTransactions,
  } = useShiftStore();

  const userName = useAuthStore((state) => state.userName);
  const [showEndShiftModal, setShowEndShiftModal] = useState(false);
  const [isLoadingOffShift, setIsLoadingOffShift] = useState(false);
  const { mutate: onShift, isPending: isOnShiftPending } = useOnShift();
  const { mutate: offShift, isPending: isOffShiftPending } = useOffShift();

  //? Catch error
  interface ErrorResponse {
    detail?: string;
  }
  //? Function Handle On Shift
  function handleShiftOnWork() {
    if (!checkOnShift) {
      return toast.warn('Ca làm đang diễn ra. Vui lòng kết thúc ca trước.');
    }
    if (checkOffShift) {
      return setShowEndShiftModal(true);
    }

    onShift(undefined, {
      onSuccess: (data: OnShift) => {
        setTimeOnShift(data.start_time || getFormattedTime());
        setCheckOnShift(false);
        setCheckOffShift(false);
        setTransactions(null);
        toast.success('Bắt đầu ca làm thành công!');
      },
      onError: (error: unknown) => {
        if (isAxiosError<ErrorResponse>(error)) {
          console.error('Lỗi khi bắt đầu ca:', error.response?.data, error.response?.status);
          if (error.response?.data?.detail === 'Shift is in process !!!!') {
            setCheckOnShift(false);
            setCheckOffShift(false);
            setTimeOnShift('Đang trong ca');
            setTimeOffShift('');
            setTransactions(null);
            toast.error('Ca làm đang diễn ra. Vui lòng kết thúc ca trước.');
            return;
          }
        }
        toast.error('Không thể bắt đầu ca. Vui lòng thử lại.');
      },
    });
  }

  //? Function Handle Off Shift
  function handleShiftOffWork() {
    if (checkOnShift) {
      return toast.warn('Chưa có ca làm đang diễn ra.');
    }

    setIsLoadingOffShift(true);
    offShift(undefined, {
      onSuccess: (data: OffShift) => {
        setTimeOffShift(data.end_time || '');
        setTransactions(data.transaction || null);
        setCheckOnShift(true);
        setCheckOffShift(true);
        setIsLoadingOffShift(false);
        toast.success('Kết thúc ca làm thành công!');
      },
      onError: (error: unknown) => {
        console.error('Lỗi kết thúc ca:', error);
        setIsLoadingOffShift(false);
        toast.error('Không thể kết thúc ca. Vui lòng thử lại.');
      },
    });
  }

  return (
    <>
      <Navbar />
      {(isLoadingOffShift || isOffShiftPending) && <Loading />}
      <div className="crashie-check-shift">
        <div className="shift-title mt-[2rem] l-[10rem] border-b-[1px] border-solid border-[#d9d9d9] mb-[20px]">
          <TextBigTitle
            $fontSize="30px"
            title={
              checkOnShift ? 'Bắt đầu ca làm' : checkOffShift ? 'Kết thúc ca' : 'Đã bắt đầu ca'
            }
            $textalign="center"
          />
          <p className="text-2xl font-bold m-5 ml-[20rem]">Thu Ngân: {userName}</p>
          <p className="text-2xl font-bold m-5 ml-[20rem]">
            Ca làm: {formatToVietnamTime(timeOnShift) || 'Chưa bắt đầu'}
          </p>
          {checkOffShift && (
            <p className="text-2xl font-bold m-5 ml-[20rem]">
              Kết thúc: {formatToVietnamTime(timeOffShift)}
            </p>
          )}
        </div>
        <div className="shift-data">
          {timeOffShift && transactions !== null ? (
            <DataAfterShift transactions={transactions} />
          ) : (
            <div className="mt-[10px] h-[30rem]">
              <TextBigTitle
                $fontSize="30px"
                $color="#d9d9d9"
                $fontWeight="300"
                $textalign="center"
                title="Kết thúc ca để xem thông tin ca làm của bạn"
              />
            </div>
          )}
        </div>
        <div className="flex justify-center control-shift">
          {checkOnShift ? (
            <ButtonTextOnly
              title={isOnShiftPending ? 'Đang xử lý...' : 'Bắt đầu Ca'}
              $fontSize="20px"
              $color="#fff"
              $backgroundColor="#29A36A"
              $hoverBackgroundColor="#185F3E"
              $height="3em"
              $width="20em"
              onClick={handleShiftOnWork}
              // disabled={isOnShiftPending}
            />
          ) : (
            <ButtonTextOnly
              title={isOffShiftPending ? 'Đang xử lý...' : 'Kết thúc ca làm'}
              $fontSize="20px"
              $color="#fff"
              $backgroundColor="#29A36A"
              $hoverBackgroundColor="#185F3E"
              $height="3em"
              $width="20em"
              onClick={handleShiftOffWork}
              // disabled={isOffShiftPending}
            />
          )}
        </div>
        {showEndShiftModal && (
          <ModalBox
            title="Phiên làm việc của bạn đã kết thúc!"
            width="max-w-2xl"
            height="h-[10rem]"
            className="border border-gray-200 bg-gray-50"
            onOk={() => {
              setShowEndShiftModal(false);
            }}
            onCancel={() => {
              setShowEndShiftModal(false);
            }}
          >
            <div>
              <h3>Vui lòng đăng xuất tài khoản để tiếp tục</h3>
            </div>
          </ModalBox>
        )}
      </div>
    </>
  );
};

export default ShiftPage;
