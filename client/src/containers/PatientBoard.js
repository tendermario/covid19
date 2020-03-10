import React, { Component, createRef } from 'react'
import _ from 'lodash'
import { connect } from 'react-redux'
import { fetchQuestions, setLoading, searchQuestions, resetSearchResult, setSearchTerm, postQuestion } from '../actions'
import QuestionBoard from '../components/QuestionBoard'
import SearchBar from '../components/SearchBar'
import '../styles/PatientBoard.css'
import AddQuestionForm from '../containers/AddQuestionForm'
import FloatingMenu from '../components/FloatingMenu'


import {
  Grid,
  Header,
  Image,
  Rail,
  Ref,
  Segment,
  Sticky,
  Item,
  Search,
  Message
} from 'semantic-ui-react'



class PatientBoard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      processSumited: false
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(fetchQuestions())
  }

  handleResultSelect = (e, {result}) => {
    const { dispatch } = this.props
    dispatch(searchQuestions(this.props.questions, result.title))
  }
  handleSearchChange = (e, { value }) => {
    const { dispatch } = this.props

  dispatch(setLoading(false))
  dispatch(setSearchTerm(value))
  setTimeout(() => {
    if (this.props.searchTerm.length < 1)  {
      dispatch(resetSearchResult())
    }
    dispatch(searchQuestions(this.props.questions, this.props.searchTerm))
  }, 500)


  // submit question
  if(this.props.results.length != 0) return
  // var self = this
  setTimeout(() => {
    if(this.props.searchTerm && (this.state.prevSearchTerm !== this.props.searchTerm) ) {
      this.handleSubmitNewQuestion();
    }
  }, 2000)
}
handleSubmitNewQuestion = () => {
  const { dispatch } = this.props
    dispatch(postQuestion(this.props.searchTerm))
    this.setState({ prevSearchTerm: this.props.searchTerm })
    // dispatch(resetSearchResult());
    // dispatch(searchQuestions(this.props.questions, this.props.searchTerm))
}
contextRef = createRef()

  render() {
    return (
<div className='containerDiv'>
<Grid centered columns={2} stackable>
   <Grid.Column>
     <Ref innerRef={this.contextRef}>
       <div>
       <Sticky context={this.contextRef}>
       <div className='sticky-top'>
         <SearchBar
         isLoading={this.props.isLoading}
         results={this.props.results}
         value={this.props.searchTerm}
         handleResultSelect={this.handleResultSelect}
         handleSearchChange={this.handleSearchChange}/>
         {/*<AddQuestionForm/>*/}
         {this.props.addSuccess && this.props.messageActive &&
           <Message positive>
              <Message.Header>We've submitted your question</Message.Header>
              <p>
                Please check back later. {this.props.newQ && this.props.newQ.title}
              </p>
            </Message>
          }
          {!this.props.addSuccess && this.props.messageActive &&
            <Message error>
               <Message.Header>We've tried to submit your question</Message.Header>
               <p>
                 Sorry Something went wrong. Please try again later
               </p>
             </Message>
           }
         </div>
         </Sticky>
       <QuestionBoard
         results={this.props.results}
       />

      {/*<Rail size='mini' position='left'>
         <Sticky context={this.contextRef}>
           <Item.Group divided>
             {_.times(12, (i) => (
               <Item key={i}>

                 <Item.Content>
                   <Item.Header as='a'>Docter Algorithm</Item.Header>
                   <Item.Meta>Links</Item.Meta>
                 </Item.Content>
               </Item>
             ))}
           </Item.Group>
         </Sticky>
       </Rail>
      */}

      </div>

     </Ref>

   </Grid.Column>
   {/*

   <Grid.Column>
   <Iframe
   src={'https://webchat.botframework.com/embed/ntozwu-qna-wellspring-bot?s=inVtGkA7vCM.w7KrGgKpZeqVW9HhSX8KcdjJD6sNOAvOP_EIeUiC5g4'}
   style={'min-width: 400px; width: 100%; min-height: 500px;'}></Iframe>

   </Grid.Column>
   */}

 </Grid>
 <FloatingMenu/>
 </div>
    )
  }
}
// addSuccess: true,
// addQuestion: q
function mapStateToProps(state) {
  // console.log(state)
  return {
    ...state.questionBoard
  }
}

export default connect(mapStateToProps)(PatientBoard)
