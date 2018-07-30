'use strict';


import React from 'react';
import ReactDOM from 'react-dom';

/**
 * Add event listeners to find all elements with [data-react-class] attribute,
 * get the react class name from the attribute and render the component using
 * ReactDOM.
 * Props can be passed in using the [data-react-props] attribute as a 
 * stringified json object.
 * 
 * Based on ReactRails' ReactUJS: https://github.com/reactjs/react-rails/blob/master/react_ujs/index.js
 * 
 * Usage
 * 
 * ```javascript
 * // src/js/app.js
 * import LuckyReact from "lucky-react";
 * import { Component } from './components';
 * 
 * LuckyReact.register({ Component });
 * ```
 * 
 * And in your Lucky Page.
 * 
 * ```crystal
 * class Home::IndexPage < GuestLayout
 *   def content
 *     h1 "React Component"
 *     div "data-react-class": "Component",
 *         "data-react-props": { message: "Message" }.to_json
 * 
 *     # or if you have the lucky_react shard installed
 *     react "Component", { message: "Message" }
 *   end
 * end
 * ```
 */
var LuckyReact = {
  CLASS_NAME_ATTR: 'data-react-class',
  PROPS_ATTR: 'data-react-props',

  components: {},

  /**
   * Get all nodes with the [data-react-class] attribute
   */
  getNodes() {
    return document.querySelectorAll('[' + LuckyReact.CLASS_NAME_ATTR + ']'); 
  },

  /**
   * Iterate through the nodes and call mountComponent
   */
  mountComponents() {
    var nodes = LuckyReact.getNodes();
    
    for (var i = 0; i < nodes.length; ++i) {
      LuckyReact.mountComponent(nodes[i]);
    }
  },

  /**
   * Find nodes with [data-react-class] attribute and find the react component
   * with that class name in the registery. Get the props from 
   * [data-react-props], set the children and render the component.
   */
  mountComponent(node) {
    var className = node.getAttribute(LuckyReact.CLASS_NAME_ATTR);
    var constructor = LuckyReact.getConstructor(className);
    
    var propsJson = node.getAttribute(LuckyReact.PROPS_ATTR);
    var props = propsJson && JSON.parse(propsJson);
  
    if (!constructor) {
      var message = "Cannot find component: '" + className + "'"
      if (console && console.log) {
        console.log("%c[react-lucky] %c" + message + " for element", "font-weight: bold", "", node)
      }
      throw new Error(message + ". Make sure you've registered your component, for example: LuckyReact.register({ Component }).")
    } else {
      var children = LuckyReact.nodeChildren(node);

      ReactDOM.render(
        React.createElement(constructor, { ...props, children }),
        node
      );
    }
  },

  /**
   * Render the children of the directly with innerHTML
   */
  nodeChildren(node) {
    if (node.childNodes.length > 0) {
      return <div dangerouslySetInnerHTML={{ __html: node.innerHTML }} />
    } else {
      return null;
    }
  },

  /**
   * Unmount all react components on nodes with the [data-react-class] attribute
   */
  unmountComponents() {
    var nodes = LuckyReact.getNodes();
  
    for (var i = 0; i < nodes.length; ++i) {
      ReactDOM.unmountComponentAtNode(nodes[i]);
    }
  },  

  /**
   * Add event listeners on turbolinks load anad before-render
   */
  setup() {
    document.addEventListener('turbolinks:load', LuckyReact.mountComponents);
    document.addEventListener('turbolinks:before-render', LuckyReact.unmountComponents);
  },
  
  /**
   * Remove turbolinks event listeners
   */
  teardown() {
    document.removeEventListener('turbolinks:load', LuckyReact.mountComponents);
    document.removeEventListener('turbolinks:before-render',LuckyReact.unmountComponents);
  },
  
  /**
   * Try to find the React component's constructor function in the registry,
   * then globally then finally try eval
   */
  getConstructor(className) {
    return this.components[className] || window[className] || eval(className);
  },

  /**
   * Remove then add event listeners
   */
  start() {
    LuckyReact.teardown();
    LuckyReact.setup();
  },

  /**
   * Store references to the app's React components in a hash for later access, 
   * then call start()
   */
  register(componentHash) {
    Object.keys(componentHash).forEach(key => {
      this.components[key] = componentHash[key]
    });

    LuckyReact.start();
  },
}

module.exports = LuckyReact;
