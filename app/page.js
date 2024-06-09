import LoginButton from '../components/LoginButton.jsx'
import EnterOpenApi from '../components/EnterOpenApi.jsx'
const ButtonsPage= () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col space-y-4 items-center">
                 {/*both of them are client based component so  they are seperated from main component*/}
                <LoginButton></LoginButton>
                <EnterOpenApi></EnterOpenApi>
                
            </div>
        </div>
    );
};

export default ButtonsPage;
