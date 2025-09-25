import styled from "styled-components";

interface ButtonTextProps {
    $color?: string;
    $fontSize?: string;
    $height?: number | string;
    $width?: number | string;
    $backgroundColor?: string;
    $hoverColor?: string;
    $hoverFontSize?: string;
    $hoverHeight?: number | string;
    $hoverWidth?: number | string;
    $hoverBackgroundColor?: string;
    title: string | React.ReactNode;
    onClick?: () => void;
}

const ButtonTextOnly: React.FC<ButtonTextProps> = ({
    $color,
    $fontSize,
    $height,
    $width,
    $backgroundColor,
    $hoverColor,
    $hoverFontSize,
    $hoverHeight,
    $hoverWidth,
    $hoverBackgroundColor,
    title,
    onClick,
}) => {
    return (
        <ButtonText
            $color={$color}
            $fontSize={$fontSize}
            $height={$height}
            $width={$width}
            $backgroundColor={$backgroundColor}
            $hoverColor={$hoverColor}
            $hoverFontSize={$hoverFontSize}
            $hoverHeight={$hoverHeight}
            $hoverWidth={$hoverWidth}
            $hoverBackgroundColor={$hoverBackgroundColor}
            onClick={onClick}
            title={title}
        >
            {title}
        </ButtonText>
    );
};

export default ButtonTextOnly;

export const ButtonText = styled.button<ButtonTextProps>`
    appearance: none;
    background-color: ${({ $backgroundColor }) => $backgroundColor || "transparent"};
    border: none;
    border-radius: 0.9375em;
    box-sizing: border-box;
    color: ${({ $color }) => $color || "#3B3B3B"};
    cursor: pointer;
    display: inline-block;
    font-family: Roobert, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    font-size: ${({ $fontSize }) => $fontSize || "16px"};
    font-weight: 600;
    line-height: normal;
    margin: 0;
    height: ${({ $height }) => $height || "2em"};
    width: ${({ $width }) => $width || "7em"};
    outline: none;
    text-align: center;
    text-decoration: none;
    transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
    user-select: none;
    touch-action: manipulation;
    will-change: transform;

    &:disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    &:hover {
        color: ${({ $hoverColor }) => $hoverColor || "#fff"};
        background-color: ${({ $hoverBackgroundColor }) => $hoverBackgroundColor || "#1A1A1A"};
        box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
        transform: translateY(-2px);
    }

    &:active {
        box-shadow: none;
        transform: translateY(0);
    }
`;