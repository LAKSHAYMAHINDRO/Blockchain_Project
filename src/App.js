import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './App.css';

// ABI (Application Binary Interface) of the contract
const contractABI=

    [
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "staffMember",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "markedBy",
                    "type": "address"
                }
            ],
            "name": "AttendanceMarked",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_associateProfessor",
                    "type": "address"
                }
            ],
            "name": "addAssociateProfessor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_professor",
                    "type": "address"
                }
            ],
            "name": "addProfessor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_staffMember",
                    "type": "address"
                }
            ],
            "name": "markAttendanceForAssociateProfessor",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_staffMember",
                    "type": "address"
                }
            ],
            "name": "markAttendanceForHOD",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_staffMember",
                    "type": "address"
                }
            ],
            "name": "markAttendanceForStaff",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "associateProfessors",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "hod",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "professors",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "staffAttendance",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]


// Address of the deployed contract
const contractAddress = '0x9bF88fAe8CF8BaB76041c1db6467E7b37b977dD7'; // Replace with your contract address

function App() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [professorAddress, setProfessorAddress] = useState('');
    const [associateProfessorAddress, setAssociateProfessorAddress] = useState('');
    const [staffMemberAddress, setStaffMemberAddress] = useState('');
    const [recentlyMarkedAttendance, setRecentlyMarkedAttendance] = useState([]);

    // Connect to Web3 provider and instantiate contract
    useEffect(() => {
        const initWeb3 = async () => {
            try {
                if (window.ethereum) {
                    // Modern dapp browsers
                    const web3Instance = new Web3(window.ethereum);
                    await window.ethereum.enable(); // Request account access
                    setWeb3(web3Instance);

                    const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
                    setContract(contractInstance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setAccounts(accounts);
                } else {
                    console.log('Please install MetaMask extension!');
                }
            } catch (error) {
                console.error('Error initializing Web3:', error);
            }
        };

        initWeb3();
    }, []);

    // Function to add a professor
    const addProfessor = async () => {
        try {
            if (!contract) {
                console.error('Contract not initialized');
                return;
            }

            await contract.methods.addProfessor(professorAddress).send({ from: accounts[0] });
            console.log('Professor added successfully!');
        } catch (error) {
            console.error('Error adding professor:', error);
        }
    };

    // Function to add an associate professor
    const addAssociateProfessor = async () => {
        try {
            if (!contract) {
                console.error('Contract not initialized');
                return;
            }

            await contract.methods.addAssociateProfessor(associateProfessorAddress).send({ from: accounts[0] });
            console.log('Associate professor added successfully!');
        } catch (error) {
            console.error('Error adding associate professor:', error);
        }
    };

    // Function to mark attendance for a staff member
    const markAttendanceForStaff = async () => {
        try {
            if (!contract) {
                console.error('Contract not initialized');
                return;
            }

            await contract.methods.markAttendanceForStaff(staffMemberAddress).send({ from: accounts[0] });
            console.log('Attendance marked successfully!');

            // Add the recently marked staff member's address to the list
            setRecentlyMarkedAttendance(prevAttendance => [...prevAttendance, staffMemberAddress]);
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    return (
        <div className="App">
            <h1>Staff Attendance Manager</h1>
            <div className="section">
                <h2>Add Professor</h2>
                <input
                    type="text"
                    placeholder="Enter professor address"
                    value={professorAddress}
                    onChange={(e) => setProfessorAddress(e.target.value)}
                />
                <button onClick={addProfessor}>Add Professor</button>
            </div>
            <div className="section">
                <h2>Add Associate Professor</h2>
                <input
                    type="text"
                    placeholder="Enter associate professor address"
                    value={associateProfessorAddress}
                    onChange={(e) => setAssociateProfessorAddress(e.target.value)}
                />
                <button onClick={addAssociateProfessor}>Add Associate Professor</button>
            </div>
            <div className="section">
                <h2>Mark Attendance for Staff Member</h2>
                <input
                    type="text"
                    placeholder="Enter staff member address"
                    value={staffMemberAddress}
                    onChange={(e) => setStaffMemberAddress(e.target.value)}
                />
                <button onClick={markAttendanceForStaff}>Mark Attendance</button>
            </div>
            <div id="recentlyMarkedAttendance">
                <h2>Recently Marked Attendance</h2>
                <ul>
                    {recentlyMarkedAttendance.map((address, index) => (
                        <li key={index}>{address}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
    
}

export default App;