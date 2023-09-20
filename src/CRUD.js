import React, {useState, useEffect, Fragment} from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const CRUD = () => {

    const [data, setData] = useState([]);
    const [show, setShow] = useState(false);
    
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isActive, setIsActive] = useState(0);
    
    const [editID, setEditID] = useState('');
    const [editName, setEditName] = useState('');
    const [editAge, setEditAge] = useState('');
    const [editIsActive, setEditIsActive] = useState(0);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        getData();
    }, [])

    const applicationUrl = 'https://localhost:44345/api/';

    const getData = () => {
        axios.get(applicationUrl + 'Employee')
        .then((result)=>{
            setData(result.data)
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleEdit = (id) => {
        handleShow();
        axios.get(applicationUrl + `Employee/${id}`)
        .then((result)=>{
            setEditName(result.data.name);
            setEditAge(result.data.age);
            setEditIsActive(result.data.isActive);
            setEditID(id);
        })
        .catch((error)=>{
            console.log(error)
        })
    }

    const handleDelete = (id) => {
        if(window.confirm("Are you sure you want to delete this employee?") === true){
            axios.delete(applicationUrl + `Employee/${id}`)
            .then((result) => {
                if(result.status === 200){
                    getData();
                    toast.success('Employee has been deleted');
                }
            }).catch((error) => {
                toast.error(error);
            })
        }
    }

    const handleUpdate = () => {
        const data ={
            "id": editID,
            "name": editName,
            "age": editAge,
            "isActive": editIsActive
        }
        axios.put(applicationUrl + `Employee/${editID}`, data)
        .then((result) => {
            getData();
            setShow(false);
            toast.success('Employee has been updated');
        }).catch((error) => {
            toast.error(error);
        })
    }

    const handleSave = () => {
        const data = {
            "name": name,
            "age": age,
            "isActive": isActive
        }

        axios.post(applicationUrl + 'Employee', data)
        .then((result) => {
            getData();
            clear();
            toast.success('Employee has been added');
        }).catch((error) => {
            toast.error(error);
        })
    }

    const clear = () => {
        setName('');
        setAge('');
        setIsActive(0);
        setEditName('');
        setEditAge('');
        setEditIsActive(0);
        setEditID('');
    }

    const handleActiveChange = (e) => {
        if(e.target.checked){
            setIsActive(1);
        }
        else{
            setIsActive(0);
        }
    }
   
    const handleEditActiveChange = (e) => {
        if(e.target.checked){
            setEditIsActive(1);
        }
        else{
            setEditIsActive(0);
        }
    }

    return (
        <Fragment>
            <ToastContainer/>
            <Container>
                <Row>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Name" value={name} onChange={(e) => setName(e.target.value)}/>
                    </Col>
                    <Col>
                    <input type="text" className="form-control" placeholder="Enter Age" value={age} onChange={(e) => setAge(e.target.value)}/>
                    </Col>
                    <Col>
                    <input type="checkbox" checked={isActive === 1 ? true:false} onChange={(e) => handleActiveChange(e)} value={isActive}/>
                    <label>IsActive</label>
                    </Col>
                    <Col>
                    <button className="btn btn-primary" onClick={() => handleSave()}>Submit</button>
                    </Col>
                </Row>
            </Container>
            <br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>isActive</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        data && data.length > 0 ? data.map((item, index)=>{
                            return(
                            <tr key = {index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.age}</td>
                                <td>{item.isActive === 1 ? "Yes" : "No"}</td>
                                <td colSpan={2}>
                                    <button className="btn btn-primary mx-1" onClick={() => handleEdit(item.id)}>Edit</button>
                                    <button className="btn btn-danger mx-1" onClick={() => handleDelete(item.id)}>Delete</button>
                                </td>
                            </tr>                    
                            )
                        })
                        :
                        'Loading...'
                    }
                </tbody>
            </Table>
            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Employee</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                        <input type="text" className="form-control" placeholder="Enter Name" value={editName} onChange={(e) => setEditName(e.target.value)}/>
                        </Col>
                        <Col>
                        <input type="text" className="form-control" placeholder="Enter Age" value={editAge} onChange={(e) => setEditAge(e.target.value)}/>
                        </Col>
                        <Col>
                        <input type="checkbox" checked={editIsActive === 1 ? true:false} onChange={(e) => handleEditActiveChange(e)} value={editIsActive}/>
                        <label>IsActive</label>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default CRUD;