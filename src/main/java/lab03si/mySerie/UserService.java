package lab03si.mySerie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import javax.transaction.Transactional;

@Service
@Transactional
public class UserService {
	
	@Autowired
	private UserPersist userPersist;

	public User login(User user) throws Exception {
		if (userPersist.isMember(user)) {
			User userData = userPersist.getUserByLogin(user.getEmail(), user.getPassword());
			userData.setLogged(true);
			return userData;
		} else {
			throw new Exception("Access denied");
		}
	}
	
	public User getUserById(User user) throws Exception {
		if (userPersist.isMember(user)) {
			User userData = userPersist.getUserById(user.getId());
			return userData;
		} else {
			throw new Exception("Acess danied");
		}
	}

	public User registerUser(User user) throws Exception {
		if (!userPersist.isMember(user)) {
			return userPersist.registerUser(user);
		} else {
			throw new Exception("Email already not exists");
		}
	}

	public User updateUser(User user) {
		return userPersist.updateUser(user);
	}
}