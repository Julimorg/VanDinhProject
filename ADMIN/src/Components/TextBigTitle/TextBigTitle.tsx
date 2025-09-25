import styled from 'styled-components';

interface TextBigTitleProps {
  $color?: string;
  $fontSize?: string;
  $fontWeight?: string;
  $textalign?: string;
  title: string;
}

const TextBigTitle: React.FC<TextBigTitleProps> = ({ $color, $fontSize, $fontWeight, $textalign, title, }) => {
  return (
    <>
      <TitleText
        $color={$color}
        $fontSize={$fontSize}
        $fontWeight={$fontWeight}
        $textalign={$textalign}
        title={title}>
        {title}
      </TitleText>
    </>
  );
};

export default TextBigTitle;

export const TitleText = styled.h1<TextBigTitleProps>`
  font-size: ${({ $fontSize }) => $fontSize || '16px'};
  color: ${({ $color }) => $color || '#3B3B3B'};
  font-weight: ${({ $fontWeight }) => $fontWeight || 'bold'};
  text-align: ${({ $textalign }) => $textalign || 'left'};
`;
