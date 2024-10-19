import DashboardNavbar from "../components/DashboardNavbar";

import axios from "axios";
import { useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
function Dashboard(){
    const { user } = useSelector((state) => state.user);
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();
  
    const getCustomerInfo = async () => {
      try {
        const response = await axios.post(
          // "http://localhost:8080/api/v1/getUserData",
          "http://localhost:9004/api/getUserData",
          { username: user?.username },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.data) {
          setCustomer(response.data.data);
          console.log(esponse.data.data);
        }
      } catch (error) {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      }
    };
    useEffect(() => {
      getCustomerInfo();
      //eslint-disable-next-line
    }, []);
    return(
        <>
   
        </>
    )
}

export default Dashboard;