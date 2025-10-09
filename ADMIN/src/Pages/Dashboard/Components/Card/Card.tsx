import styled from "styled-components";
// import { Button } from "@/components/button";

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick?: () => void;
}

const CardWrapper = styled.div`
  background: #fff;
  padding: 1.2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  flex: 1;
  height: 100%;
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

const StyledButton = styled.button`
  background-color: #1aad88;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #33CC33

;
  }
`;

const Card = ({ icon, title, description, buttonText, onClick, }: CardProps) => {
  return (
    <CardWrapper>
      <IconWrapper>{icon}</IconWrapper>
      <Title>{title}</Title>
      <Description>{description}</Description>
      <StyledButton onClick={onClick}>{buttonText}</StyledButton> 
    </CardWrapper>
  );
};


export default Card;
