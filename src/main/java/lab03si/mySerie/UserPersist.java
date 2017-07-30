package lab03si.mySerie;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

@Repository
public class UserPersist {
	
	private static final Long UNIQUE = 1L;
	
	private static final String QUERY_EXIST = new StringBuilder()
	         .append("SELECT COUNT(1) ")
	         .append("FROM User u ")
	         .append("WHERE u.email=:email ")
	         .toString();
	
	@PersistenceContext
	private EntityManager em;

	public User registerUser(User user) {
		em.persist(user);
		return user;
	}

	public User getUserByLogin(String email, String password) {
		TypedQuery<User> query = em.createQuery("select obj from User obj where obj.email = :email and obj.password = :password", User.class);
	    query.setParameter("email", email);
	    query.setParameter("password", password);
	    return query.getSingleResult();
	}
	
	public User getUserById(Long id) {
		TypedQuery<User> query = em.createQuery("select obj from User obj where obj.id = :id", User.class);
	    query.setParameter("id", id);
	    return query.getSingleResult();
	}
	
	public boolean isMember(User user) {
	     TypedQuery<Long> getUserQuery = em.createQuery(QUERY_EXIST, Long.class);
	     getUserQuery.setParameter("email", user.getEmail());
	     return UNIQUE.equals(getUserQuery.getSingleResult());
	 }

	public User updateUser(User user) {
		User oldUser = this.getUserById(user.getId());
		oldUser.setMySeries(user.getMySeries());
		oldUser.setWatchList(user.getWatchList());
		oldUser = em.merge(oldUser);
		em.flush();
		em.refresh(oldUser);
		return oldUser;
	}
}
