import styled from "styled-components";
// import { Button } from "@/components/button"; // Import button tùy chỉnh nếu bạn có

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const CardWrapper = styled.div`
  background: #fff;
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  `;

const IconWrapper = styled.div`
  font-size: 36px;
  margin-bottom: 1rem;

  svg {
    width: 36px;
    height: 36px;
  }
`;

const Title = styled.h3`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 1rem;
`;

// 

const Card2 = ({ icon, title, description }: CardProps) => {
  return (
    <CardWrapper>
      <IconWrapper>{icon}</IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </CardWrapper>
  );
};


export default Card2;
