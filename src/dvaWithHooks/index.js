import React, { useState , useEffect  } from 'react'
import { Card, /*Button */ } from 'antd'
import { connect } from 'dva'
import puzzlecards from '../../models/puzzlecards'

const namespace = 'puzzlecards'

const mapStateToProps = (state) => {
	const cardList = state[namespace].data
	return {
	  cardList 
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onDidMount : () =>{
			dispatch({
				type: `${namespace}/queryInitCards`
			})
		}
	}
}

//只是语法糖而已  实质上就是react-redux中的connect
//@connect(mapStateToProps) 修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升
function Demo(props){
	const [ flag , setFlag ] = useState(1)
	useEffect (() =>{
		props.onDidMount()
		if(flag < 5) setFlag(flag + 1);
		console.log(flag)
	},[flag])

	return(
		<div>
			{
				props.cardList.map(card =>{
						return(
							<Card key={card.id}>
								<div>Q: {card.title}</div>
								<div>
									<strong>A: {card.body}</strong>
								</div>
							</Card>
						)
					})
				}
		</div>
	)
}

export default connect(mapStateToProps,mapDispatchToProps)(Demo)


const namespace = 'puzzlecards'

const mapStateToProps = (state) => {
	const cardList = state[namespace].data
	return {
	  cardList 
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onDidMount : () =>{
			dispatch({
				type: `${namespace}/queryInitCards`
			})
		}
	}
}

//只是语法糖而已  实质上就是react-redux中的connect
//@connect(mapStateToProps) 修饰器只能用于类和类的方法，不能用于函数，因为存在函数提升
function Demo(props){
	const [ flag , setFlag ] = useState(1)
	useEffect (() =>{
		props.onDidMount()
		if(flag < 5) setFlag(flag + 1);
		console.log(flag)
	},[flag])

	return(
		<div>
			{
				props.cardList.map(card =>{
						return(
							<Card key={card.id}>
								<div>Q: {card.title}</div>
								<div>
									<strong>A: {card.body}</strong>
								</div>
							</Card>
						)
					})
				}
		</div>
	)
}

export default connect(mapStateToProps,mapDispatchToProps)(Demo)
