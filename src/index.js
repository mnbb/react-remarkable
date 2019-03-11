'use strict';

import React from 'react';
import Markdown from 'remarkable';

class Remarkable extends React.Component {

  render() {
    var Container = this.props.container;

    return (
      <Container>
        {this.content()}
      </Container>
    );
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.options !== this.props.options) {
      this.md = this.createMarkdown(nextProps.options, nextProps.plugins);
    }
  }

  content() {
    if (this.props.source) {
      return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(this.props.source) }} />;
    }
    else {
      return React.Children.map(this.props.children, child => {
        if (typeof child === 'string') {
          return <span dangerouslySetInnerHTML={{ __html: this.renderMarkdown(child) }} />;
        }
        else {
          return child;
        }
      });
    }
  }

  renderMarkdown(source) {
    if (!this.md) {
      this.md = this.createMarkdown(this.props.options, this.props.plugins);
    }

    return this.md.render(source);
  }

  createMarkdown(options, plugins) {
    return plugins.reduce((md, p) => {
      var plugin = p;
      var options;
      if (Array.isArray(p)) {
        plugin = p[0];
        options = p[1];
      }
      return md.use(plugin, options);
    }, new Markdown(options));
  }
}

Remarkable.defaultProps = {
  container: 'div',
  options: {},
  plugins: [],
};

export default Remarkable;
