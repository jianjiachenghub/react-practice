import React from 'react';
import { Redirect } from "react-router-dom";
import { renderRoutes } from 'react-router-config';
import HooksRouter from '../components/HooksRouter'
import ImmerRouter from '../components/ImmerRouter'
import RefsRouter from '../components/RefsRouter'
import CssInJs from '../components/CssInJsRouter'
import Hello from '../cssInJs/Hello'
import Box from '../cssInJs/Box'
import PropsButton from '../cssInJs/PropsButton'
import Keyframes from '../cssInJs/Keyframes'
import ComplexSelector from '../cssInJs/ComplexSelector'
import useMemo from '../hooks/useMemo'
import useReducer from '../hooks/useReducer'
import useContext from '../hooks/useContext'
import useRef from '../hooks/useRef'
import usePrevious from '../hooks/usePrevious'
import useClientRect from '../hooks/useClientRect'
import state from '../immer/state'
import refsForWard from '../refs/refsForward'
import higherOrderRefsForwardIndex from '../refs/higherOrderRefsForwardIndex'

export default [
  {
    path: "/",
    component: Hello,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/hooks"}/>
      },
      {
        path: "/cssInJs",
        component: CssInJs,
        routes: [
          {
            path: "/cssInJs/Box",
            component: Box
          },
          {
            path: "/cssInJs/PropsButton",
            component: PropsButton
          },
          {
            path: "/cssInJs/Keyframes",
            component: Keyframes
          },
          {
            path: "/cssInJs/ComplexSelector",
            component: ComplexSelector
          },
        ]
      },
      {
        path: "/hooks",
        component: HooksRouter,
        routes: [
          {
            path: "/hooks/useMemo",
            component: useMemo
          },
          {
            path: "/hooks/useReducer",
            component: useReducer
          },
          {
            path: "/hooks/useContext",
            component: useContext
          },
          {
            path: "/hooks/useRef",
            component: useRef
          },
          {
            path: "/hooks/usePrevious",
            component: usePrevious
          },
          {
            path: "/hooks/useClientRect",
            component: useClientRect
          },
        ]
      },
      {
        path: "/immer",
        component: ImmerRouter,
        routes: [
          {
            path: "/immer/state",
            component: state
          }
        ]
      },
      {
        path: "/refs",
        component: RefsRouter,
        routes: [
          {
            path: "/refs/refsForWard",
            component: refsForWard
          },
          {
            path: "/refs/higherOrderRefsForwardIndex",
            component: higherOrderRefsForwardIndex
          }
        ]
      },
/*       {
        path: "/singers",
        component: Singers
      },
      {
        path: "/rank",
        component: Rank
      } */
    ]
  }
]