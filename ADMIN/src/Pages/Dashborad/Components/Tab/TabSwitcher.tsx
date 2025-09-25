import styled from 'styled-components';

const TabWrapper = styled.div`
  display: flex;
  background: #e5e7eb;
  border-radius: 8px;
  margin: 0;
  padding: 0.5rem;
`;

const Box = styled.div`
  border: 1px solid #514b4b;
  border-radius: 8px;
  padding: 5px;
  background-color: #fff;
  flex: 1;
  text-align: center;
`;

const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 0.6rem;
  font-weight: bold;
  background-color: ${({ $active }) => ($active ? '#20d1a4' : '#e5e7eb')};
  border-radius: 8px;
  border: none;
  cursor: pointer;
`;

interface TabSwitcherProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

const TabSwitcher = ({ activeTab, onChange }: TabSwitcherProps) => {
  return (
    <Box>
      <TabWrapper>
        <Tab $active={activeTab === 'QuanLyVe'} onClick={() => onChange('QuanLyVe')}>
          Quản lý vé
        </Tab>
        <Tab $active={activeTab === 'CaLamViec'} onClick={() => onChange('CaLamViec')}>
          Ca làm việc
        </Tab>
      </TabWrapper>
    </Box>
  );
};

export default TabSwitcher;
