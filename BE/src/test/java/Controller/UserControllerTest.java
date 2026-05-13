package Controller;


import com.example.managementapi.Dto.Request.User.CreateUserReq;
import com.example.managementapi.Dto.Response.User.CreateUserRes;
import com.example.managementapi.Service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

@Slf4j
//@SpringBootTest
@AutoConfigureMockMvc
@ExtendWith(MockitoExtension.class)
public class UserControllerTest {

//    @Autowired
    private MockMvc mockMvc;

    @Mock
    private UserService userService;


    private CreateUserReq createUserReq;

    private CreateUserRes createUserRes;


    @BeforeEach
    void initData(){

    }

    @Test
    void createUser() {
        log.info(" Hello Test ");

    }
}
