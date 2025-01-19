import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.body.style.backgroundColor = !isDarkMode ? '#121212' : 'white';
        document.body.style.color = !isDarkMode ? 'white' : 'black';
    };

    const handleSidebarClick = (route) => {
        setIsSidebarOpen(false);
        navigate(route);
    };

    const buttonStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: 'transparent',
        color: isDarkMode ? 'white' : 'black',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease-in-out',
        border: 'none',
    };

    const buttonHoverStyle = {
        backgroundColor: '#D3D3D3',
    };

    const dividerStyle = {
        borderTop: '1px solid #D3D3D3',
        margin: '0',
    };

    const sliderContainerStyle = {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        padding: '10px',
    };

    const sliderStyle = {
        width: '40px',
        height: '20px',
        backgroundColor: isDarkMode ? '#333' : '#D3D3D3',
        borderRadius: '10px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginLeft: '10px',
    };

    const sliderCircleStyle = {
        width: '18px',
        height: '18px',
        backgroundColor: isDarkMode ? 'white' : 'black',
        borderRadius: '50%',
        position: 'absolute',
        top: '1px',
        left: isDarkMode ? '20px' : '2px',
        transition: 'left 0.3s ease',
    };

    return (
        <>
            {/* Full-screen white background layer */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: isDarkMode ? '#121212' : 'white',
                    zIndex: -1, // Ensures it stays behind all UI components
                }}
            ></div>

            <nav style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                padding: '10px 30px',
                backgroundColor: isDarkMode ? '#121212' : 'white',
                color: isDarkMode ? 'white' : 'black',
                fontSize: '18px',
                zIndex: '1000',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
            }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div 
                        style={{ marginRight: '15px', cursor: 'pointer' }} 
                        onClick={toggleSidebar}
                    >
                        <span style={{ fontSize: '24px', color: isDarkMode ? 'white' : 'black' }}>☰</span>
                    </div>
                    
                    <span style={{ fontWeight: 'bold', fontSize: '24px', color: isDarkMode ? 'white' : 'black' }}>NASA</span>
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <div style={{ fontSize: '20px', fontWeight: '500', color: isDarkMode ? 'white' : 'black' }}>Translator</div>
                </div>
                <div style={{ position: 'relative' }}>
                    <button 
                        onClick={toggleDropdown} 
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                        }}
                    >
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu6lZJ1sgRzwv6DARHJdNx3IImEukvu5DHbA&s"
                            alt="Right Icon"
                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                        />
                    </button>
                    {isDropdownOpen && (
                        <div style={{
                            position: 'absolute',
                            top: '50px',
                            right: 0,
                            backgroundColor: isDarkMode ? '#333' : 'white',
                            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                            borderRadius: '4px',
                            zIndex: 1000,
                            width: '200px',
                            color: isDarkMode ? 'white' : 'black',
                        }}>
                            <button
                                style={buttonStyle}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                onClick={() => navigate('/login-signup')}
                            >
                                <span style={{ marginRight: '10px' }}>🔑</span> Log In / Sign Up
                            </button>
                            <hr style={dividerStyle} />
                            <div style={sliderContainerStyle}>
                                <span>🌙 Dark Mode</span>
                                <div style={sliderStyle} onClick={toggleDarkMode}>
                                    <div style={sliderCircleStyle}></div>
                                </div>
                            </div>
                            <hr style={dividerStyle} />
                            <button
                                style={buttonStyle}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span style={{ marginRight: '10px' }}>❓</span> Help Center
                            </button>
                            <hr style={dividerStyle} />
                            <button
                                style={buttonStyle}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <span style={{ marginRight: '10px' }}>📞</span> Contact Us
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div style={{
                position: 'fixed',
                top: 0,
                left: isSidebarOpen ? '0' : '-200px',
                height: '100vh',
                width: '200px',
                backgroundColor: isDarkMode ? '#121212' : 'white',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                zIndex: 999,
                padding: '20px',
                boxSizing: 'border-box',
                transition: 'left 0.3s ease-in-out',
            }}>
                <h3 style={{ color: isDarkMode ? 'white' : 'black', marginBottom: '20px' }}>Menu</h3>
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSidebarClick('/')}>
                    <span style={{ marginRight: '10px' }}>📝</span> Translator
                </button>
                <hr style={dividerStyle} />
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleSidebarClick('/upload-video')}>
                    <span style={{ marginRight: '10px' }}>📤</span> Upload
                </button>
                <hr style={dividerStyle} />
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <span style={{ marginRight: '10px' }}>📢</span> Publish
                </button>
            </div>
        </>
    );
};

export default NavBar;