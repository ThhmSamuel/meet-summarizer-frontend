import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Box, Paper, Typography } from '@mui/material';

/**
 * Component to render Markdown content
 * @param {Object} props
 * @param {String} props.content - Markdown content to render
 * @param {Boolean} props.paper - Whether to wrap the content in a Paper component
 */
const MarkdownRenderer = ({ content, paper = true }) => {
  const markdownComponents = {
    h1: (props) => <Typography variant="h3" gutterBottom {...props} />,
    h2: (props) => <Typography variant="h4" gutterBottom {...props} />,
    h3: (props) => <Typography variant="h5" gutterBottom {...props} />,
    h4: (props) => <Typography variant="h6" fontWeight="bold" gutterBottom {...props} />,
    h5: (props) => <Typography variant="subtitle1" fontWeight="bold" gutterBottom {...props} />,
    h6: (props) => <Typography variant="subtitle2" fontWeight="bold" gutterBottom {...props} />,
    p: (props) => <Typography variant="body1" paragraph {...props} />,
    ul: (props) => <Box component="ul" sx={{ mb: 2, pl: 2 }} {...props} />,
    ol: (props) => <Box component="ol" sx={{ mb: 2, pl: 2 }} {...props} />,
    li: (props) => <Typography component="li" variant="body1" sx={{ mb: 0.5 }} {...props} />,
    blockquote: (props) => (
      <Box
        component="blockquote"
        sx={{
          pl: 2,
          borderLeft: '4px solid',
          borderColor: 'grey.300',
          fontStyle: 'italic',
          my: 2
        }}
        {...props}
      />
    ),
    hr: (props) => <Box component="hr" sx={{ my: 3, borderColor: 'grey.300' }} {...props} />,
    table: (props) => (
      <Box
        component="table"
        sx={{
          width: '100%',
          mb: 2,
          borderCollapse: 'collapse',
          border: '1px solid',
          borderColor: 'grey.300'
        }}
        {...props}
      />
    ),
    tr: (props) => <Box component="tr" sx={{ borderBottom: '1px solid', borderColor: 'grey.300' }} {...props} />,
    th: (props) => (
      <Box
        component="th"
        sx={{
          p: 1.5,
          textAlign: 'left',
          backgroundColor: 'grey.100',
          fontWeight: 'bold'
        }}
        {...props}
      />
    ),
    td: (props) => <Box component="td" sx={{ p: 1.5, borderRight: '1px solid', borderColor: 'grey.300' }} {...props} />,
    strong: (props) => <Typography component="span" fontWeight="bold" display="inline" {...props} />,
    em: (props) => <Typography component="span" fontStyle="italic" display="inline" {...props} />
  };

  const ContentWrapper = paper ? Paper : React.Fragment;
  const wrapperProps = paper ? { 
    elevation: 1, 
    sx: { p: 3, overflow: 'auto' } 
  } : {};

  return (
    <ContentWrapper {...wrapperProps}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]} // Enables GitHub Flavored Markdown
        components={markdownComponents}
      >
        {content}
      </ReactMarkdown>
    </ContentWrapper>
  );
};

export default MarkdownRenderer;