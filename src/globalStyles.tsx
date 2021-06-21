import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  html {         //(DarkMode Text & Light Mode Elements)
    --maxWidth: 1200px;
    --bs: 0px 0px 25px -7px rgba(0, 0, 0, 0.25);
    font-size: 62.5%;
  }
  *, *:before, *:after {
    box-sizing: border-box;
    box-sizing: inherit;
    margin: 0;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: 1.4rem;
    line-height: 2;
    font-family: 'Nunito Sans', sans-serif;
  }
  button {
    font-family: 'Nunito Sans', sans-serif;
    cursor: pointer;
  }
`;

export const ContainerStyles = styled.div`
  max-width: var(--maxWidth);
  margin: 0 auto;
  padding: 1rem 3rem;
`;
