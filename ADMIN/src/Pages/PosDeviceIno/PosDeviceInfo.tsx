import React, { useEffect, useState } from 'react';



const PosDeviceInfo: React.FC = () => {
  const [ipAddress, setIpAddress] = useState<string>('Đang tải...');
  const [machineId, setMachineId] = useState<string>('Đang tải...');
  const [macAddress, setMacAddress] = useState<string>('Đang tải...');

  const fetchIpAddress = async () => {
    try {
      if (!window.electronAPI) {
        throw new Error('electronAPI không được định nghĩa');
      }
      const ip = await window.electronAPI.getIpAddress();
      setIpAddress(ip);
      console.log('IP:', ip);
    } catch (error) {
      console.error('Lỗi khi lấy IP:', error);
      setIpAddress('Lỗi khi lấy IP');
    }
  };

  const fetchMachineId = async () => {
    try {
      if (!window.electronAPI) {
        throw new Error('electronAPI không được định nghĩa');
      }
      const id = await window.electronAPI.getMachineId();
      setMachineId(id);
      console.log('Machine ID:', id);
    } catch (error) {
      console.error('Lỗi khi lấy Machine ID:', error);
      setMachineId('Lỗi khi lấy Machine ID');
    }
  };

  const fetchMacAddress = async () => {
    try {
      if (!window.electronAPI) {
        throw new Error('electronAPI không được định nghĩa');
      }
      const mac = await window.electronAPI.getMacAddress();
      setMacAddress(mac);
      console.log('MAC:', mac);
    } catch (error) {
      console.error('Lỗi khi lấy MAC:', error);
      setMacAddress('Lỗi khi lấy MAC');
    }
  };

  useEffect(() => {
    if (window.electronAPI) {
      fetchIpAddress();
      fetchMachineId();
      fetchMacAddress();
    } else {
      console.error('electronAPI không khả dụng khi component mount');
      setIpAddress('Lỗi: electronAPI không khả dụng');
      setMachineId('Lỗi: electronAPI không khả dụng');
      setMacAddress('Lỗi: electronAPI không khả dụng');
    }
  }, []);

  return (
    <div>
      <h1>Thông tin máy</h1>
      <p><strong>Địa chỉ IP:</strong> {ipAddress}</p>
      <p><strong>Machine ID:</strong> {machineId}</p>
      <p><strong>Địa chỉ MAC:</strong> {macAddress}</p>
    </div>
  );
};

export default PosDeviceInfo;