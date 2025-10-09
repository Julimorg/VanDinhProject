import React from 'react';
import styled from 'styled-components';

interface TicketTypeBoxProps {
  title: string;
  description: string;
}

const Box = styled.div`
  border: 1px solid #d1d5db; /* border-gray-300 */
  padding: 1rem;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const Title = styled.h4`
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1rem;

`;

const Description = styled.p`
  font-size: 0.95rem;
  color: #333;
`;

const TicketTypeBox: React.FC<TicketTypeBoxProps> = ({ title, description }) => {
  return (
    <Box>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </Box>
  );
};

export default TicketTypeBox;
