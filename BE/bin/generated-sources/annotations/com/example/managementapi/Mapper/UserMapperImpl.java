package com.example.managementapi.Mapper;

import com.example.managementapi.Dto.Request.Auth.SignUpReq;
import com.example.managementapi.Dto.Request.User.CreateUserReq;
import com.example.managementapi.Dto.Request.User.UpdateUseReq;
import com.example.managementapi.Dto.Request.User.UpdateUserByAdminReq;
import com.example.managementapi.Dto.Response.User.CreateUserRes;
import com.example.managementapi.Dto.Response.User.GetProfileDetailRes;
import com.example.managementapi.Dto.Response.User.GetUserProfileDetailByAdminRes;
import com.example.managementapi.Dto.Response.User.GetUserRes;
import com.example.managementapi.Dto.Response.User.GetUserSelectionRes;
import com.example.managementapi.Dto.Response.User.OrderInGetUserDetailRes;
import com.example.managementapi.Dto.Response.User.RoleInGetUserRes;
import com.example.managementapi.Dto.Response.User.SearchByAdminRes;
import com.example.managementapi.Dto.Response.User.SearchByUserRes;
import com.example.managementapi.Dto.Response.User.SignUpUserRes;
import com.example.managementapi.Dto.Response.User.UpdateUserByAdminRes;
import com.example.managementapi.Dto.Response.User.UpdateUserRes;
import com.example.managementapi.Entity.Order;
import com.example.managementapi.Entity.Role;
import com.example.managementapi.Entity.User;
import com.example.managementapi.Enum.Status;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-04-10T10:06:49+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.45.0.v20260224-0835, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Autowired
    private OrderMapper orderMapper;

    @Override
    public User toUser(SignUpReq request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( request.getEmail() );
        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
        user.password( request.getPassword() );
        user.phone( request.getPhone() );
        user.userAddress( request.getUserAddress() );
        user.userDob( request.getUserDob() );
        user.userName( request.getUserName() );

        return user.build();
    }

    @Override
    public GetUserRes toGetUser(User user) {
        if ( user == null ) {
            return null;
        }

        GetUserRes.GetUserResBuilder getUserRes = GetUserRes.builder();

        getUserRes.createAt( user.getCreateAt() );
        getUserRes.email( user.getEmail() );
        getUserRes.firstName( user.getFirstName() );
        getUserRes.id( user.getId() );
        getUserRes.lastName( user.getLastName() );
        getUserRes.phone( user.getPhone() );
        getUserRes.roles( roleSetToRoleInGetUserResList( user.getRoles() ) );
        if ( user.getStatus() != null ) {
            getUserRes.status( user.getStatus().name() );
        }
        getUserRes.updateAt( user.getUpdateAt() );
        getUserRes.userAddress( user.getUserAddress() );
        getUserRes.userDob( user.getUserDob() );
        getUserRes.userImg( user.getUserImg() );
        getUserRes.userName( user.getUserName() );

        return getUserRes.build();
    }

    @Override
    public SearchByAdminRes toUserSearchResByAdmin(User user) {
        if ( user == null ) {
            return null;
        }

        SearchByAdminRes.SearchByAdminResBuilder searchByAdminRes = SearchByAdminRes.builder();

        searchByAdminRes.createAt( user.getCreateAt() );
        searchByAdminRes.email( user.getEmail() );
        searchByAdminRes.id( user.getId() );
        searchByAdminRes.roles( roleSetToRoleInGetUserResList( user.getRoles() ) );
        if ( user.getStatus() != null ) {
            searchByAdminRes.status( user.getStatus().name() );
        }
        searchByAdminRes.updateAt( user.getUpdateAt() );
        searchByAdminRes.userImg( user.getUserImg() );
        searchByAdminRes.userName( user.getUserName() );

        return searchByAdminRes.build();
    }

    @Override
    public SearchByUserRes toUserSearchResByUser(User user) {
        if ( user == null ) {
            return null;
        }

        SearchByUserRes.SearchByUserResBuilder searchByUserRes = SearchByUserRes.builder();

        searchByUserRes.createAt( user.getCreateAt() );
        searchByUserRes.email( user.getEmail() );
        searchByUserRes.id( user.getId() );
        if ( user.getStatus() != null ) {
            searchByUserRes.status( user.getStatus().name() );
        }
        searchByUserRes.updateAt( user.getUpdateAt() );
        searchByUserRes.userImg( user.getUserImg() );
        searchByUserRes.userName( user.getUserName() );

        return searchByUserRes.build();
    }

    @Override
    public GetUserProfileDetailByAdminRes toGetUserProfileDetailByAdminRes(User user) {
        if ( user == null ) {
            return null;
        }

        GetUserProfileDetailByAdminRes.GetUserProfileDetailByAdminResBuilder getUserProfileDetailByAdminRes = GetUserProfileDetailByAdminRes.builder();

        getUserProfileDetailByAdminRes.createAt( user.getCreateAt() );
        getUserProfileDetailByAdminRes.email( user.getEmail() );
        getUserProfileDetailByAdminRes.firstName( user.getFirstName() );
        getUserProfileDetailByAdminRes.id( user.getId() );
        getUserProfileDetailByAdminRes.lastName( user.getLastName() );
        getUserProfileDetailByAdminRes.phone( user.getPhone() );
        getUserProfileDetailByAdminRes.roles( roleSetToRoleInGetUserResSet( user.getRoles() ) );
        if ( user.getStatus() != null ) {
            getUserProfileDetailByAdminRes.status( user.getStatus().name() );
        }
        getUserProfileDetailByAdminRes.updateAt( user.getUpdateAt() );
        getUserProfileDetailByAdminRes.userAddress( user.getUserAddress() );
        if ( user.getUserDob() != null ) {
            getUserProfileDetailByAdminRes.userDob( DateTimeFormatter.ISO_LOCAL_DATE.format( user.getUserDob() ) );
        }
        getUserProfileDetailByAdminRes.userImg( user.getUserImg() );
        getUserProfileDetailByAdminRes.userName( user.getUserName() );

        return getUserProfileDetailByAdminRes.build();
    }

    @Override
    public GetProfileDetailRes toGetProfileDetailRes(User user) {
        if ( user == null ) {
            return null;
        }

        GetProfileDetailRes.GetProfileDetailResBuilder getProfileDetailRes = GetProfileDetailRes.builder();

        getProfileDetailRes.createAt( user.getCreateAt() );
        getProfileDetailRes.email( user.getEmail() );
        getProfileDetailRes.firstName( user.getFirstName() );
        getProfileDetailRes.id( user.getId() );
        getProfileDetailRes.lastName( user.getLastName() );
        getProfileDetailRes.orders( orderListToOrderInGetUserDetailResList( user.getOrders() ) );
        getProfileDetailRes.phone( user.getPhone() );
        if ( user.getStatus() != null ) {
            getProfileDetailRes.status( user.getStatus().name() );
        }
        getProfileDetailRes.updateAt( user.getUpdateAt() );
        getProfileDetailRes.userAddress( user.getUserAddress() );
        if ( user.getUserDob() != null ) {
            getProfileDetailRes.userDob( DateTimeFormatter.ISO_LOCAL_DATE.format( user.getUserDob() ) );
        }
        getProfileDetailRes.userImg( user.getUserImg() );
        getProfileDetailRes.userName( user.getUserName() );

        return getProfileDetailRes.build();
    }

    @Override
    public User toCreateStaff(CreateUserReq request) {
        if ( request == null ) {
            return null;
        }

        User.UserBuilder user = User.builder();

        user.email( request.getEmail() );
        user.firstName( request.getFirstName() );
        user.lastName( request.getLastName() );
        user.password( request.getPassword() );
        user.phone( request.getPhone() );
        user.userAddress( request.getUserAddress() );
        user.userDob( request.getUserDob() );
        user.userName( request.getUserName() );

        return user.build();
    }

    @Override
    public CreateUserRes toCreateStaffRes(User user) {
        if ( user == null ) {
            return null;
        }

        CreateUserRes.CreateUserResBuilder createUserRes = CreateUserRes.builder();

        createUserRes.createAt( user.getCreateAt() );
        createUserRes.email( user.getEmail() );
        createUserRes.firstName( user.getFirstName() );
        createUserRes.id( user.getId() );
        createUserRes.lastName( user.getLastName() );
        createUserRes.phone( user.getPhone() );
        createUserRes.roles( roleSetToRoleInGetUserResList( user.getRoles() ) );
        if ( user.getStatus() != null ) {
            createUserRes.status( user.getStatus().name() );
        }
        createUserRes.userAddress( user.getUserAddress() );
        if ( user.getUserDob() != null ) {
            createUserRes.userDob( DateTimeFormatter.ISO_LOCAL_DATE.format( user.getUserDob() ) );
        }
        createUserRes.userImg( user.getUserImg() );
        createUserRes.userName( user.getUserName() );

        return createUserRes.build();
    }

    @Override
    public SignUpUserRes toSignUpUserRes(User user) {
        if ( user == null ) {
            return null;
        }

        SignUpUserRes.SignUpUserResBuilder signUpUserRes = SignUpUserRes.builder();

        signUpUserRes.createAt( user.getCreateAt() );
        signUpUserRes.email( user.getEmail() );
        signUpUserRes.firstName( user.getFirstName() );
        signUpUserRes.id( user.getId() );
        signUpUserRes.lastName( user.getLastName() );
        signUpUserRes.phone( user.getPhone() );
        signUpUserRes.userAddress( user.getUserAddress() );
        if ( user.getUserDob() != null ) {
            signUpUserRes.userDob( DateTimeFormatter.ISO_LOCAL_DATE.format( user.getUserDob() ) );
        }
        signUpUserRes.userName( user.getUserName() );

        return signUpUserRes.build();
    }

    @Override
    public void updateProfile(User user, UpdateUseReq request) {
        if ( request == null ) {
            return;
        }

        if ( request.getEmail() != null ) {
            user.setEmail( request.getEmail() );
        }
        if ( request.getFirstName() != null ) {
            user.setFirstName( request.getFirstName() );
        }
        if ( request.getLastName() != null ) {
            user.setLastName( request.getLastName() );
        }
        if ( request.getPhone() != null ) {
            user.setPhone( request.getPhone() );
        }
        if ( request.getUserAddress() != null ) {
            user.setUserAddress( request.getUserAddress() );
        }
        if ( request.getUserDob() != null ) {
            user.setUserDob( request.getUserDob() );
        }
        if ( request.getUserName() != null ) {
            user.setUserName( request.getUserName() );
        }
    }

    @Override
    public void updateUser(User user, UpdateUserByAdminReq request) {
        if ( request == null ) {
            return;
        }

        if ( request.getEmail() != null ) {
            user.setEmail( request.getEmail() );
        }
        if ( request.getFirstName() != null ) {
            user.setFirstName( request.getFirstName() );
        }
        if ( request.getLastName() != null ) {
            user.setLastName( request.getLastName() );
        }
        if ( request.getPhone() != null ) {
            user.setPhone( request.getPhone() );
        }
        if ( user.getRoles() != null ) {
            Set<Role> set = request.getRoles();
            if ( set != null ) {
                user.getRoles().clear();
                user.getRoles().addAll( set );
            }
        }
        else {
            Set<Role> set = request.getRoles();
            if ( set != null ) {
                user.setRoles( new LinkedHashSet<Role>( set ) );
            }
        }
        if ( request.getStatus() != null ) {
            user.setStatus( Enum.valueOf( Status.class, request.getStatus() ) );
        }
        if ( request.getUserAddress() != null ) {
            user.setUserAddress( request.getUserAddress() );
        }
        if ( request.getUserDob() != null ) {
            user.setUserDob( request.getUserDob() );
        }
        if ( request.getUserName() != null ) {
            user.setUserName( request.getUserName() );
        }
    }

    @Override
    public UpdateUserByAdminRes toResUpdateUserByAdmin(User user) {
        if ( user == null ) {
            return null;
        }

        UpdateUserByAdminRes.UpdateUserByAdminResBuilder updateUserByAdminRes = UpdateUserByAdminRes.builder();

        updateUserByAdminRes.email( user.getEmail() );
        updateUserByAdminRes.firstName( user.getFirstName() );
        updateUserByAdminRes.lastName( user.getLastName() );
        updateUserByAdminRes.phone( user.getPhone() );
        updateUserByAdminRes.roles( roleSetToRoleInGetUserResSet( user.getRoles() ) );
        if ( user.getStatus() != null ) {
            updateUserByAdminRes.status( user.getStatus().name() );
        }
        updateUserByAdminRes.updateAt( user.getUpdateAt() );
        updateUserByAdminRes.userAddress( user.getUserAddress() );
        updateUserByAdminRes.userDob( user.getUserDob() );
        updateUserByAdminRes.userImg( user.getUserImg() );
        updateUserByAdminRes.userName( user.getUserName() );

        return updateUserByAdminRes.build();
    }

    @Override
    public UpdateUserRes toResUpdateUser(User user) {
        if ( user == null ) {
            return null;
        }

        UpdateUserRes.UpdateUserResBuilder updateUserRes = UpdateUserRes.builder();

        updateUserRes.email( user.getEmail() );
        updateUserRes.firstName( user.getFirstName() );
        updateUserRes.lastName( user.getLastName() );
        updateUserRes.phone( user.getPhone() );
        updateUserRes.updateAt( user.getUpdateAt() );
        updateUserRes.userAddress( user.getUserAddress() );
        updateUserRes.userDob( user.getUserDob() );
        updateUserRes.userImg( user.getUserImg() );
        updateUserRes.userName( user.getUserName() );

        return updateUserRes.build();
    }

    @Override
    public GetUserSelectionRes toGetUserSelection(User user) {
        if ( user == null ) {
            return null;
        }

        GetUserSelectionRes.GetUserSelectionResBuilder getUserSelectionRes = GetUserSelectionRes.builder();

        getUserSelectionRes.firstName( user.getFirstName() );
        getUserSelectionRes.id( user.getId() );
        getUserSelectionRes.lastName( user.getLastName() );
        getUserSelectionRes.userName( user.getUserName() );

        return getUserSelectionRes.build();
    }

    protected RoleInGetUserRes roleToRoleInGetUserRes(Role role) {
        if ( role == null ) {
            return null;
        }

        RoleInGetUserRes.RoleInGetUserResBuilder roleInGetUserRes = RoleInGetUserRes.builder();

        roleInGetUserRes.description( role.getDescription() );
        roleInGetUserRes.name( role.getName() );

        return roleInGetUserRes.build();
    }

    protected List<RoleInGetUserRes> roleSetToRoleInGetUserResList(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        List<RoleInGetUserRes> list = new ArrayList<RoleInGetUserRes>( set.size() );
        for ( Role role : set ) {
            list.add( roleToRoleInGetUserRes( role ) );
        }

        return list;
    }

    protected Set<RoleInGetUserRes> roleSetToRoleInGetUserResSet(Set<Role> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleInGetUserRes> set1 = new LinkedHashSet<RoleInGetUserRes>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Role role : set ) {
            set1.add( roleToRoleInGetUserRes( role ) );
        }

        return set1;
    }

    protected List<OrderInGetUserDetailRes> orderListToOrderInGetUserDetailResList(List<Order> list) {
        if ( list == null ) {
            return null;
        }

        List<OrderInGetUserDetailRes> list1 = new ArrayList<OrderInGetUserDetailRes>( list.size() );
        for ( Order order : list ) {
            list1.add( orderMapper.toOrderInGetUserDetailRes( order ) );
        }

        return list1;
    }
}
