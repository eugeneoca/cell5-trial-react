import './App.css';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Form,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading
} from 'reactstrap';
import {API_URL} from './config/Config'
import WithListLoading from './components/WithListLoading'

function App() {

  const [dataState, setDataState] = useState({
    isLoading: false,
    data: null
  });

  const [modalState, setModalState] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add Subject");
  const [patchData, setPatchData] = useState({
    id: null,
    name: null
  })

  const [sortData, setSortData] = useState(false);

  const [searchData, setSearchData] = useState("");

  const handleClose = () => setModalState(false);
  const handleShowAddSubject = () => {
    setModalTitle("Add Subject")
    setModalState(true)
  };
  const handleShowUpdateSubject = (data) => {
    setModalTitle("Update Subject")
    setModalState(true)
    setPatchData(data)
  };
  const handleModalToggle = () => setModalState(!modalState)

  const createSubject = (e) => {
    e.preventDefault()
    const data = new FormData(document.getElementById("createForm"))
    fetch(API_URL+"/api/hobby",{
      method: 'POST',
      body: data,
      headers: new Headers({
        'Accept' : 'application/json'
      })
    })
    .then((response) => {
      if(response.ok){
        reloadListHandler()
      }
    })
  };

  useEffect(()=>{
    reloadListHandler(sortData, searchData)
  }, [setDataState, sortData, searchData]);

  const reloadListHandler = (sort=false, search="") => {
    setDataState({isLoading: true})
    fetch(API_URL+"/api/hobby?sort="+sort+"&search="+search,{
      method: 'GET',
      headers: new Headers({
        'Accept' : 'application/json'
      })
    })
    .then((response) => response.json())
    .then((jdata) => {
      setDataState({isLoading: false, data:jdata})
    })
  };

  const deleteSubject = (subject_id) => {
    setDataState({isLoading: true})
    fetch(API_URL+"/api/hobby/"+subject_id,{
      method: 'DELETE',
      headers: new Headers({
        'Accept' : 'application/json'
      })
    })
    .then((response) => {
      if(response.ok){
        reloadListHandler()
      }
    })
  };

  const updateSubject = (e) => {
    e.preventDefault()
    setDataState({isLoading: true})
    var data = new FormData(document.getElementById("createForm"))
    data.append("_method", "PATCH")
    fetch(API_URL+"/api/hobby/"+patchData.id,{
      method: 'POST',
      body: data,
      headers: new Headers({
        'Accept' : 'application/json'
      })
    })
    .then((response) => {
      if(response.ok){
        reloadListHandler()
      }
    })
  };

  const List = (props) => {
    const { data } = props;
    if (!data || data.length === 0) return <p>No data, sorry</p>;
    return (
      <ListGroup>
          <ListGroupItemHeading>Engineering Subjects</ListGroupItemHeading>
          {data.map((data) => {
              return (
                  <ListGroupItem key={data.id}>
                      <div className="text-right float-right">
                        <Button color="primary" onClick={() => {handleShowUpdateSubject(data)}}>Edit</Button>
                        <Button color="danger" onClick={() => {deleteSubject(data.id)}}>Delete</Button>
                      </div>
                      <div className="text-left"><h2>{data.name}</h2></div>
                      <br/>
                      <div dangerouslySetInnerHTML={{__html: data.description}} />
                  </ListGroupItem>
              );
          })}
      </ListGroup>
    );
  };

  const ListLoading = WithListLoading(List);

  const handleToggleSort = ()=> {
    setSortData(!sortData);
  };

  const handleSearchEngine = (event)=>{
    setSearchData(event.target.value)
  };
  
  return (
    <Container>
      <FormGroup>
        <Label for="search">Search:</Label>
        <Input type="text" name="search" id="search" placeholder="Keyword" onChange={handleSearchEngine}/>
      </FormGroup>
      <ListLoading isLoading={dataState.isLoading} data={dataState.data}/>
      <Button onClick={handleShowAddSubject} style={{marginRight:"10px", marginTop:"10px"}}>Add Subject</Button>
      <Button onClick={handleToggleSort} style={{marginTop:"10px"}}>Toggle Name Sort</Button>

      <Modal  toggle={handleModalToggle} isOpen={modalState}>
        <Form id="createForm" onSubmit={modalTitle==="Add Subject" ? createSubject:updateSubject}>
          <ModalHeader toggle={handleModalToggle}>
            {modalTitle}
          </ModalHeader>
          <ModalBody>
          
            <FormGroup>
              <Label for="name">Subject Name</Label>
              <Input type="text" name="name" id="name" placeholder={modalTitle==="Update Subject" ? patchData.name:"Subject Name" }/>
            </FormGroup>
          
          </ModalBody>
          <ModalFooter>
            <Button style={{width:'100px'}}  onClick={handleClose} >Cancel</Button>
            <Button style={{width:'100px'}} color="success" type="submit" onClick={handleClose}>{modalTitle==="Update Subject" ? "Save":"Create" }</Button>
          </ModalFooter>
        </Form>
      </Modal>
    </Container>
  )
}

export default App;
