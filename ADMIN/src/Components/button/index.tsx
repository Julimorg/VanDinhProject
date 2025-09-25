import styled from "styled-components";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledButton = styled.button`
  background-color: #12b76a;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    background-color: #0f9d58;
  }
`;

export const Button = ({ children, onClick }: ButtonProps) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};
