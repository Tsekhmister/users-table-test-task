import "./App.css";
import Table from "./components/Table/Table";
import LoginForm from "./components/LoginForm/LoginForm";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";
import { RootState } from "./redux/store";

function App() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div className="App">
      {isAuthenticated ? <Table /> : <LoginForm />}
    </div>
  );
}

function AppWrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default AppWrapper;