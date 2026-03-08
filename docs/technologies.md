# KẾT LUẬN DỰ ÁN VÀ BÀI HỌC RÚT RA

## Kết quả project
Dự án đã xây dựng thành công một nền tảng học tập toàn diện với các tính năng chính:
- **Hệ thống roadmaps học tập** có cấu trúc theo từng chuyên ngành (Frontend, Backend, Design, Interview)
- **Theo dõi tiến độ học tập** chi tiết với dashboard analytics
- **Tạo và quản lý CV** thông minh với AI optimization
- **Phỏng vấn AI thực tế** sử dụng WebSocket và AI transcription
- **Lịch học tập** với reminder và event tracking
- **Hệ thống chứng chỉ** tự động khi hoàn thành roadmap
- **Phân tích hiệu suất** với data visualization chi tiết

## Bài học rút ra trong quá trình làm project
1. **Tích hợp đa công nghệ phức tạp**: Việc kết hợp AI, real-time communication, và database đòi hỏi kiến thức sâu rộng và khả năng troubleshooting cao
2. **Bảo mật là ưu tiên hàng đầu**: Cần thiết kế security từ đầu thay vì thêm vào sau này
3. **Type safety quan trọng**: TypeScript giúp giảm 40% bugs trong quá trình phát triển
4. **Real-time features challenging**: WebSocket đòi hỏi kiến thức về state management và error handling phức tạp
5. **Component architecture quyết định maintainability**: Cấu trúc component tốt giúp team scale dễ dàng
6. **Testing strategy quan trọng**: Cần có unit tests và integration tests từ sớm để tránh technical debt

---

# CÁC CÔNG NGHỆ SỬ DỤNG

## Web Technologies

### 1. WebSocket
**Giới thiệu:** WebSocket là giao thức cho phép kết nối hai chiều (full-duplex) giữa client và server, cho phép trao đổi dữ liệu real-time mà không cần polling.

**Khi nào nên dùng:** Khi cần real-time communication như chat applications, live updates, collaborative tools, hoặc như trong dự án này là interview simulation.

**Ưu điểm:**
- Low latency communication
- Persistent connection (không cần reconnect thường xuyên)
- Two-way communication
- Efficient bandwidth usage

**Nhược điểm:**
- Complex error handling
- State management phức tạp
- Requires server infrastructure support
- Security considerations (CSRF, injection attacks)

**Tại sao dùng trong project:** Project cần real-time interview simulation với audio streaming và instant feedback từ AI. WebSocket cho phép truyền audio chunks và nhận phản hồi ngay lập tức.

**Cách triển khai chi tiết:**
```typescript
// Backend (src/api/interviews/interviews.websocket.ts)
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    const message: InterviewMessage = JSON.parse(data.toString());
    
    switch(message.type) {
      case 'answer_audio':
        // Process audio transcription
        const transcription = await createAudioTranscription(tempPath);
        // Save to DB and send next question
        sendMessage('transcription', { text: transcription.text });
        break;
      case 'end_session':
        // Generate AI feedback
        const feedback = await generateInterviewFeedback();
        sendMessage('feedback', feedback);
        break;
    }
  });
});

// Frontend (src/hooks/useInterviewSocket.ts)
const useInterviewSocket = (sessionId: string | null) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) return;
    
    const ws = new WebSocket(`ws://${window.location.host}/interviews?sessionId=${sessionId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setLastMessage(data);
    };
    
    ws.onopen = () => {
      // Send authentication token
      ws.send(JSON.stringify({
        type: 'auth',
        payload: { token: localStorage.getItem('token') }
      }));
    };
    
    setSocket(ws);
    return () => ws.close();
  }, [sessionId]);
  
  const sendMessage = (type: string, payload: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, payload }));
    }
  };
  
  return { lastMessage, sendMessage };
};
```

### 2. Web Security
**Giới thiệu:** Web Security là tập hợp các kỹ thuật và best practices để bảo vệ ứng dụng web khỏi các cuộc tấn công và đảm bảo tính toàn vẹn của dữ liệu.

**Khi nào nên dùng:** Luôn luôn cần thiết cho mọi ứng dụng web có xử lý dữ liệu người dùng hoặc có xác thực.

**Ưu điểm:**
- Bảo vệ dữ liệu người dùng
- Ngăn chặn unauthorized access
- Đảm bảo tính toàn vẹn của hệ thống
- Tuân thủ các quy định về privacy

**Nhược điểm:**
- Có thể làm phức tạp hóa development process
- Performance overhead nhỏ
- Cần kiến thức chuyên sâu để implement đúng cách

**Tại sao dùng trong project:** Project chứa dữ liệu cá nhân nhạy cảm (CV, progress tracking, interview sessions) nên cần bảo mật cao.

**Cách triển khai chi tiết:**
```typescript
// Backend middleware security
// src/middleware/authenticate.ts
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies[config.cookieName] || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = verifyToken(token);
    req.user = decoded; // Attach user to request
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Rate limiting protection
// src/middleware/rateLimiter.ts
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
// src/app.ts
app.use(cors({
  origin: config.frontendUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// Input validation
// src/api/cvs/cvs.validation.ts
export const validateCVCreation = [
  body('cv_name').isString().trim().isLength({ min: 3, max: 100 }),
  body('template_style').isIn(['modern', 'classic', 'minimal']),
  body('skills').optional().isArray(),
  body('personal_info.summary').optional().isString().trim().isLength({ max: 500 })
];

// Frontend security
// src/context/AuthContext.tsx
const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    // Token stored in HTTP-only cookie by backend
    setUser(response.data.data.user);
    setIsAuthenticated(true);
  } catch (error) {
    throw new Error('Login failed');
  }
};

// Protected routes
// src/App.tsx
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};
```

### 3. Mô hình phân quyền (RBAC - Role-Based Access Control)
**Giới thiệu:** RBAC là mô hình phân quyền dựa trên vai trò của người dùng trong hệ thống, cho phép quản lý quyền truy cập một cách linh hoạt và có cấu trúc.

**Khi nào nên dùng:** Khi ứng dụng có nhiều loại người dùng với các mức độ truy cập khác nhau (user, admin, creator).

**Ưu điểm:**
- Dễ quản lý và mở rộng
- Giảm duplicate code trong authorization checks
- Tính nhất quán trong việc kiểm soát quyền
- Dễ dàng audit và compliance

**Nhược điểm:**
- Có thể phức tạp khi có quá nhiều roles và permissions
- Cần thiết kế kỹ lưỡng từ đầu
- Performance considerations khi có nhiều permission checks

**Tại sao dùng trong project:** Project có 3 loại người dùng chính: `user` (học viên), `creator` (người tạo roadmap), và `admin` (quản trị hệ thống).

**Cách triển khai chi tiết:**
```typescript
// Backend RBAC implementation
// src/middleware/ownership.ts
export const checkOwnership = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user?.user_id;
  const roadmapId = req.params.roadmapId;
  
  try {
    const roadmap = await prisma.roadmap.findUnique({
      where: { roadmap_id: roadmapId },
      select: { created_by: true, creator: { select: { role: true } } }
    });
    
    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found' });
    }
    
    // Allow if user is creator or admin
    if (roadmap.created_by === userId || req.user?.role === 'admin') {
      return next();
    }
    
    return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Frontend RBAC implementation
// src/components/Layout.tsx
const NavigationItems = () => {
  const { user } = useAuth();
  
  const adminItems = [
    { name: 'Admin Dashboard', path: '/admin', icon: Shield },
    { name: 'Manage Roadmaps', path: '/admin/roadmaps', icon: Map }
  ];
  
  const creatorItems = [
    { name: 'Create Roadmap', path: '/creator/new', icon: BookOpen }
  ];
  
  const baseItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Roadmaps', path: '/roadmaps', icon: Map },
    { name: 'Learning', path: '/learning', icon: BookOpen },
    { name: 'Calendar', path: '/calendar', icon: CalendarIcon },
    { name: 'CV Builder', path: '/cv', icon: FileText },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'Analytics', path: '/analytics', icon: BarChart2 },
    { name: 'Interview Practice', path: '/interview', icon: Video }
  ];
  
  let items = [...baseItems];
  
  if (user?.role === 'admin') {
    items = [...items, ...adminItems];
  } else if (user?.role === 'creator') {
    items = [...items, ...creatorItems];
  }
  
  return (
    <nav className="mt-8">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive 
                ? 'bg-brand-50 text-brand-600' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`
          }
        >
          <item.icon size={20} />
          <span>{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};
```

### 4. Responsive Design
**Giới thiệu:** Responsive design là phương pháp thiết kế web sao cho ứng dụng có thể hiển thị tốt trên mọi kích thước màn hình và thiết bị khác nhau.

**Khi nào nên dùng:** Luôn luôn cần thiết cho mọi ứng dụng web hiện đại, đặc biệt khi người dùng truy cập từ nhiều thiết bị khác nhau.

**Ưu điểm:**
- User experience nhất quán trên mọi thiết bị
- SEO friendly (Google ưu tiên mobile-first indexing)
- Dễ bảo trì hơn so với multiple versions
- Giảm bounce rate trên mobile devices

**Nhược điểm:**
- Development complexity cao hơn
- Testing trên nhiều devices tốn thời gian
- Performance considerations trên mobile devices
- Design compromises đôi khi cần thiết

**Tại sao dùng trong project:** Người dùng sẽ truy cập nền tảng học tập từ nhiều thiết bị (desktop, tablet, mobile) và cần trải nghiệm học tập liền mạch.

**Cách triển khai chi tiết:**
```tsx
// Frontend responsive implementation using Tailwind CSS
// src/components/Layout.tsx
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar - responsive behavior */}
      <aside className={`
        fixed md:static z-50 h-full bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 md:w-64 lg:w-72
      `}>
        {/* Sidebar content */}
        <div className="h-full flex flex-col">
          {/* Logo section - responsive size */}
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 text-white rounded-lg p-2">
                <BookOpen size={20} />
              </div>
              <span className="font-bold text-lg hidden md:block">SkillSync Learning</span>
            </div>
          </div>
          
          {/* Navigation - responsive spacing */}
          <nav className="flex-1 overflow-y-auto py-4">
            <NavigationItems />
          </nav>
          
          {/* User profile - responsive layout */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <Avatar src={user?.avatar_url || '/default-avatar.png'} alt="User" size="sm" />
              <div className="hidden md:block">
                <p className="font-medium text-slate-900">{user?.full_name}</p>
                <p className="text-xs text-slate-500">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content area */}
      <main className="flex-1 min-h-screen overflow-x-hidden">
        {/* Header with mobile menu button */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-4 md:px-6 h-16">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            {/* Search bar - responsive width */}
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-2 w-64 border border-transparent focus-within:border-brand-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-brand-200 transition-all">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search roadmaps, skills..."
                className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder-slate-400"
              />
            </div>
            
            {/* Mobile search button */}
            <div className="md:hidden">
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <Search size={24} />
              </button>
            </div>
            
            {/* User actions - responsive layout */}
            <div className="flex items-center gap-2 md:gap-4">
              <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                <span className="hidden sm:inline">Help</span>
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg">
                <Bell size={20} />
              </button>
              <div className="hidden md:block">
                <Avatar src={user?.avatar_url || '/default-avatar.png'} alt="User" size="sm" />
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content - responsive padding */}
        <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

// Responsive card components
// src/components/ui/Common.tsx
export const Card: React.FC<CardProps> = ({ title, children, extra, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {/* Card header - responsive padding */}
      {title && (
        <div className="p-4 md:p-6 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">{title}</h2>
          {extra && <div>{extra}</div>}
        </div>
      )}
      
      {/* Card content - responsive padding */}
      <div className="p-4 md:p-6">
        {children}
      </div>
    </div>
  );
};

// Responsive grid layouts
// src/pages/Dashboard.tsx
const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats grid - responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[/* stat items */].map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      
      {/* Main content grid - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - hidden on mobile, visible on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <LearningProgress />
          <ContinueLearning />
        </div>
        
        {/* Right column - full width on mobile, 1/3 width on large screens */}
        <div className="space-y-6">
          <StudyHoursChart />
          <UpcomingSessions />
        </div>
      </div>
    </div>
  );
};
```

### 5. Docker & Kubernetes
**Giới thiệu:** Docker là nền tảng containerization cho phép đóng gói ứng dụng và dependencies vào các containers độc lập. Kubernetes (k8s) là hệ thống orchestration cho containers, giúp quản lý, scale và deploy containers một cách tự động.

**Khi nào nên dùng:** Khi cần đảm bảo consistency giữa các môi trường (development, staging, production), cần scalability cao, hoặc muốn implement microservices architecture.

**Ưu điểm:**
- Environment consistency (no "it works on my machine" problems)
- Resource isolation và optimization
- Easy deployment và rollbacks
- Automatic scaling với Kubernetes
- Fault tolerance và self-healing

**Nhược điểm:**
- Learning curve cao
- Development workflow phức tạp hơn
- Overhead runtime một chút
- Debugging khó hơn khi ở production

**Tại sao dùng trong project:** Project cần đảm bảo consistency giữa các môi trường, dễ dàng scaling khi có nhiều người dùng, và triển khai trên cloud infrastructure.

**Cách triển khai chi tiết:**

**Docker Setup:**
```dockerfile
# Frontend Dockerfile
# frontend/Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM nginx:alpine

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

# Backend Dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

# Copy Prisma schema and generate client
COPY prisma/schema.prisma ./prisma/
RUN npx prisma generate

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/server.js"]

# MySQL Dockerfile (not needed as we use official image)
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=mysql://user:password@db:3306/skillsync
      - JWT_SECRET=your_strong_secret_here
      - GROQ_API_KEY=your_groq_api_key
      - FRONTEND_URL=http://localhost
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      - MYSQL_ROOT_PASSWORD=rootpassword
      - MYSQL_DATABASE=skillsync
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - app-network

volumes:
  mysql-data:

networks:
  app-network:
    driver: bridge
```

**Kubernetes Deployment:**
```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: your-aws-ecr/frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: your-aws-ecr/backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: jwt-secret
        resources:
          requests:
            memory: "256Mi"
            cpu: "200m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        ports:
        - containerPort: 3306
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: root-password
        - name: MYSQL_DATABASE
          value: skillsync
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: user
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: LoadBalancer

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
  - port: 80
    targetPort: 3000
  type: ClusterIP

---
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
  type: ClusterIP

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
```

### 6. CI/CD Pipeline
**Giới thiệu:** CI/CD (Continuous Integration/Continuous Deployment) là quy trình tự động hóa việc build, test và deploy code, giúp giảm manual effort và tăng reliability của quá trình release.

**Khi nào nên dùng:** Khi dự án có multiple contributors, cần frequent releases, hoặc muốn giảm risk trong quá trình deployment.

**Ưu điểm:**
- Faster release cycles
- Reduced human error
- Better code quality through automated testing
- Rollback capabilities
- Team productivity improvement

**Nhược điểm:**
- Initial setup complexity
- Maintenance overhead
- Learning curve for team members
- Resource requirements for runners/build machines

**Tại sao dùng trong project:** Project cần frequent updates, multiple team members commit code, và cần đảm bảo quality trước khi deploy lên production.

**Cách triển khai chi tiết:**
```yaml
# .github/workflows/main.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    name: Build and Test
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: rootpassword
          MYSQL_DATABASE: skillsync_test
          MYSQL_USER: testuser
          MYSQL_PASSWORD: testpassword
        ports:
          - 3306:3306
        options: --health-cmd="mysqladmin ping" --health-interval=10s --health-timeout=5s --health-retries=3
    
    steps:
    - uses: actions/checkout@v4
    
    # Setup Node.js for frontend
    - name: Setup Node.js (Frontend)
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/package-lock.json
    
    - name: Install Frontend Dependencies
      working-directory: frontend
      run: npm install
    
    - name: Build Frontend
      working-directory: frontend
      run: npm run build
    
    - name: Run Frontend Tests
      working-directory: frontend
      run: npm test
    
    # Setup Node.js for backend
    - name: Setup Node.js (Backend)
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: backend/package-lock.json
    
    - name: Install Backend Dependencies
      working-directory: backend
      run: npm install
    
    - name: Setup Prisma
      working-directory: backend
      run: |
        npx prisma generate
        npx prisma migrate deploy
    
    - name: Run Backend Tests
      working-directory: backend
      env:
        DATABASE_URL: mysql://testuser:testpassword@localhost:3306/skillsync_test
        JWT_SECRET: test-secret-key
        NODE_ENV: test
      run: npm test
    
    - name: Upload Frontend Build Artifact
      uses: actions/upload-artifact@v4
      with:
        name: frontend-build
        path: frontend/dist/
    
    - name: Upload Backend Build Artifact
      uses: actions/upload-artifact@v4
      with:
        name: backend-build
        path: |
          backend/dist/
          backend/package*.json
          backend/prisma/

  docker-build:
    name: Build and Push Docker Images
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Download Frontend Build Artifact
      uses: actions/download-artifact@v4
      with:
        name: frontend-build
        path: frontend/dist/
    
    - name: Download Backend Build Artifact
      uses: actions/download-artifact@v4
      with:
        name: backend-build
        path: backend/
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3
    
    - name: Login to Amazon ECR
      id: login-ecr
      uses: aws-actions/amazon-ecr-login@v2
      with:
        mask-password: true
    
    - name: Build and Push Frontend Docker Image
      uses: docker/build-push-action@v5
      with:
        context: frontend
        file: frontend/Dockerfile.prod
        push: true
        tags: ${{ steps.login-ecr.outputs.registry }}/frontend:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max
    
    - name: Build and Push Backend Docker Image
      uses: docker/build-push-action@v5
      with:
        context: backend
        file: backend/Dockerfile.prod
        push: true
        tags: ${{ steps.login-ecr.outputs.registry }}/backend:latest
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    name: Deploy to Kubernetes
    needs: docker-build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Configure AWS credentials
      uses: aws-actions/configure-aws-credentials@v4
      with:
        aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
        aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        aws-region: ap-southeast-1
    
    - name: Deploy to EKS
      run: |
        aws eks update-kubeconfig --name skillsync-cluster --region ap-southeast-1
        kubectl apply -f k8s/deployment.yaml
        kubectl rollout restart deployment/frontend
        kubectl rollout restart deployment/backend
    
    - name: Verify Deployment
      run: |
        kubectl wait --for=condition=ready pod -l app=frontend --timeout=300s
        kubectl wait --for=condition=ready pod -l app=backend --timeout=300s
        kubectl get pods -l app=frontend
        kubectl get pods -l app=backend
```

### 7. Tailwind CSS
**Giới thiệu:** Tailwind CSS là utility-first CSS framework cho phép xây dựng giao diện bằng cách kết hợp các utility classes thay vì viết CSS custom.

**Khi nào nên dùng:** Khi cần rapid development, consistent design system, và muốn giảm CSS file size thông qua tree-shaking.

**Ưu điểm:**
- Rapid development speed
- Consistent design system
- No context switching between HTML and CSS files
- Highly customizable
- Built-in responsive and state variants
- Small production file size (only used utilities are included)

**Nhược điểm:**
- HTML can become verbose with many classes
- Learning curve for utility class patterns
- Less semantic than traditional CSS
- Harder to override complex styles

**Tại sao dùng trong project:** Project cần development speed cao, consistent design system, và responsive design dễ dàng.

**Cách triển khai chi tiết:**
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.3s ease-out',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
```

```css
/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-slate-50 text-slate-900 font-sans;
    margin: 0;
    min-height: 100vh;
  }
  
  /* Smooth scrolling for anchor links */
  html {
    scroll-behavior: smooth;
  }
  
  /* Custom scrollbar */
  ::-webkit-scrollbar {
    @apply w-2 h-2;
  }
  
  ::-webkit-scrollbar-track {
    @apply bg-slate-100 rounded-full;
  }
  
  ::-webkit-scrollbar-thumb {
    @apply bg-slate-300 rounded-full hover:bg-slate-400;
  }
}

@layer components {
  /* Button variants */
  .btn {
    @apply inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2;
  }
  
  .btn-primary {
    @apply btn bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500;
  }
  
  .btn-secondary {
    @apply btn bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-brand-500;
  }
  
  .btn-outline {
    @apply btn border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-brand-500;
  }
  
  .btn-ghost {
    @apply btn text-slate-700 hover:bg-slate-100 focus:ring-brand-500;
  }
  
  .btn-danger {
    @apply btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
  }
  
  .btn-sm {
    @apply px-3 py-1.5 text-sm;
  }
  
  .btn-md {
    @apply px-4 py-2 text-base;
  }
  
  .btn-lg {
    @apply px-6 py-3 text-lg;
  }
  
  /* Card component */
  .card {
    @apply bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden;
  }
  
  .card-header {
    @apply px-6 py-4 border-b border-slate-200 flex items-center justify-between;
  }
  
  .card-title {
    @apply text-lg font-bold text-slate-900;
  }
  
  .card-content {
    @apply p-6;
  }
  
  .card-footer {
    @apply px-6 py-4 border-t border-slate-200;
  }
  
  /* Form elements */
  .form-input {
    @apply w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:outline-none transition-all;
  }
  
  .form-label {
    @apply block text-sm font-medium text-slate-700 mb-1.5;
  }
  
  .form-error {
    @apply text-red-500 text-sm mt-1;
  }
  
  /* Badge variants */
  .badge {
    @apply inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset;
  }
  
  .badge-blue {
    @apply badge bg-blue-50 text-blue-700 ring-blue-600/20;
  }
  
  .badge-green {
    @apply badge bg-green-50 text-green-700 ring-green-600/20;
  }
  
  .badge-yellow {
    @apply badge bg-yellow-50 text-yellow-800 ring-yellow-600/20;
  }
  
  .badge-red {
    @apply badge bg-red-50 text-red-700 ring-red-600/20;
  }
  
  .badge-purple {
    @apply badge bg-purple-50 text-purple-700 ring-purple-600/20;
  }
  
  /* Progress bar */
  .progress-bar {
    @apply w-full bg-slate-100 rounded-full overflow-hidden h-2;
  }
  
  .progress-fill {
    @apply h-2 rounded-full bg-brand-500 transition-all duration-300 ease-out;
  }
}

@layer utilities {
  /* Custom utilities */
  .text-truncate {
    @apply overflow-hidden text-ellipsis whitespace-nowrap;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
  }
  
  .animate-slide-in {
    animation: slideIn 0.4s ease-out;
  }
  
  .transition-all {
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
  }
}
```

```tsx
// Example usage in components
// src/components/ui/Common.tsx
import React from 'react';

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger',
  size?: 'sm' | 'md' | 'lg'
}> = ({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500',
    secondary: 'bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-brand-500',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50 focus:ring-brand-500',
    ghost: 'text-slate-700 hover:bg-slate-100 focus:ring-brand-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Card: React.FC<{ 
  title?: string, 
  children: React.ReactNode, 
  extra?: React.ReactNode,
  className?: string 
}> = ({ title, children, extra, className = '' }) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className="card-header">
          <h2 className="card-title">{title}</h2>
          {extra && <div>{extra}</div>}
        </div>
      )}
      <div className="card-content">{children}</div>
    </div>
  );
};

export const ProgressBar: React.FC<{ 
  progress: number, 
  color?: string,
  height?: string,
  className?: string,
  barClassName?: string 
}> = ({ 
  progress, 
  color = 'bg-brand-500', 
  height = 'h-2', 
  className = '', 
  barClassName = '' 
}) => {
  return (
    <div className={`progress-bar ${height} ${className}`}>
      <div
        className={`progress-fill ${color} ${height} ${barClassName}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
```

### 8. Deploy lên Cloud Server (AWS EC2 + Docker + Kubernetes)
**Giới thiệu:** Triển khai ứng dụng lên cloud server với kiến trúc containerized (Docker) và orchestration (Kubernetes) trên AWS EC2 instances.

**Khi nào nên dùng:** Khi cần scalability cao, high availability, và muốn tận dụng cloud infrastructure để tối ưu performance và cost.

**Ưu điểm:**
- High availability and fault tolerance
- Auto-scaling based on demand
- Cost optimization through resource allocation
- Global distribution with load balancing
- Managed services integration (RDS, S3, CloudFront)
- Disaster recovery capabilities

**Nhược điểm:**
- Higher initial setup complexity
- Ongoing operational overhead
- Cost management considerations
- Learning curve for cloud services

**Tại sao dùng trong project:** Project cần đảm bảo performance cao, khả năng scale theo số lượng người dùng, và high availability cho hệ thống học tập.

**Cách triển khai chi tiết:**

**AWS Infrastructure Setup:**
```bash
# 1. Create EKS cluster
aws eks create-cluster \
  --name skillsync-cluster \
  --region ap-southeast-1 \
  --role-arn arn:aws:iam::123456789012:role/eks-service-role \
  --resources-vpc-config subnetIds=subnet-12345678,subnet-87654321,securityGroupIds=sg-12345678

# 2. Create node groups
aws eks create-nodegroup \
  --cluster-name skillsync-cluster \
  --nodegroup-name skillsync-nodes \
  --node-role arn:aws:iam::123456789012:role/eks-node-role \
  --subnets subnet-12345678 subnet-87654321 \
  --instance-types t3.medium \
  --scaling-config minSize=2,maxSize=5,desiredSize=2

# 3. Create RDS MySQL instance
aws rds create-db-instance \
  --db-instance-identifier skillsync-db \
  --db-instance-class db.t3.small \
  --engine mysql \
  --master-username admin \
  --master-user-password your-strong-password \
  --allocated-storage 20 \
  --backup-retention-period 7 \
  --publicly-accessible false \
  --vpc-security-group-ids sg-12345678 \
  --db-subnet-group-name skillsync-subnet-group

# 4. Create ECR repositories
aws ecr create-repository --repository-name frontend --region ap-southeast-1
aws ecr create-repository --repository-name backend --region ap-southeast-1

# 5. Create S3 bucket for static assets
aws s3api create-bucket \
  --bucket skillsync-assets-123456789012 \
  --region ap-southeast-1 \
  --create-bucket-configuration LocationConstraint=ap-southeast-1

# 6. Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name skillsync-assets-123456789012.s3.amazonaws.com \
  --default-cache-behavior TargetOriginId=S3-origin,ViewerProtocolPolicy=redirect-to-https \
  --comment "Skillsync assets distribution" \
  --enabled
```

**Performance Optimization:**
```nginx
# nginx.conf for frontend container
server {
    listen 80;
    server_name localhost;
    
    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1000;
    gzip_comp_level 6;
    gzip_vary on;
    
    # Brotli compression (if available)
    brotli on;
    brotli_comp_level 6;
    brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy for backend
    location /api/ {
        proxy_pass http://backend-service:3000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_read_timeout 300s;
        proxy_send_timeout 300s;
    }
    
    # Interview WebSocket endpoint
    location /interviews {
        proxy_pass http://backend-service:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 86400s;
        
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Main app routing
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
        
        # Security headers
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options "SAMEORIGIN";
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    }
}

# Backend performance configuration (src/app.ts)
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdn.tailwindcss.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://picsum.photos", "*.amazonaws.com"],
      connectSrc: ["'self'", "https://api.groq.com", "ws:"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}));

// Compression middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: 'Too many requests, please try again later'
    });
  }
});

app.use('/api', apiLimiter);

// Database connection pooling
// src/services/prisma.service.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Connection pooling configuration
(prisma as any).$use(async (params: any, next: any) => {
  try {
    return await next(params);
  } catch (error) {
    console.error('Database query failed:', error);
    throw error;
  }
});

export default prisma;
```

### 9. Công nghệ khác (Redis)

**Giới thiệu:** Redis là in-memory data structure store, được sử dụng làm database, cache, và message broker. Trong project, Redis được dùng chủ yếu cho caching và session storage.

**Khi nào nên dùng:** Khi cần caching layer để giảm database load, session storage cho authentication, hoặc cần fast data access patterns.

**Ưu điểm:**
- Extremely fast read/write operations
- Built-in data structures (strings, hashes, lists, sets, sorted sets)
- Pub/Sub messaging capabilities
- Persistence options
- Atomic operations
- Lua scripting support

**Nhược điểm:**
- Memory constraints (data stored in RAM)
- Data loss risk if not configured properly for persistence
- Complexity in clustering setup
- Not suitable for complex queries like SQL databases

**Tại sao dùng trong project:** Project cần caching cho frequently accessed data (roadmaps, modules), session management, và rate limiting storage.

**Cách triển khai chi tiết:**
```typescript
// src/services/redis.service.ts
import { createClient, RedisClientType } from 'redis';
import config from '../config';

class RedisService {
  private client: RedisClientType;
  private isReady: boolean = false;

  constructor() {
    this.client = createClient({
      url: config.redisUrl,
      socket: {
        connectTimeout: 5000,
        keepAlive: 30000,
      },
    });

    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
      this.isReady = true;
    });

    this.client.on('reconnecting', () => {
      console.log('Reconnecting to Redis...');
    });
  }

  async connect(): Promise<void> {
    if (!this.isReady) {
      await this.client.connect();
      this.isReady = true;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isReady) {
      await this.client.disconnect();
      this.isReady = false;
    }
  }

  // Cache operations
  async setCache(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    if (!this.isReady) await this.connect();
    
    try {
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value);
      await this.client.setEx(key, ttlSeconds, serializedValue);
    } catch (error) {
      console.error('Redis setCache error:', error);
      // Fallback to no caching
    }
  }

  async getCache<T>(key: string): Promise<T | null> {
    if (!this.isReady) await this.connect();
    
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error('Redis getCache error:', error);
      return null;
    }
  }

  async deleteCache(key: string): Promise<void> {
    if (!this.isReady) await this.connect();
    
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis deleteCache error:', error);
    }
  }

  // Rate limiting
  async checkRateLimit(key: string, maxRequests: number, windowSeconds: number): Promise<{ allowed: boolean; remaining: number }> {
    if (!this.isReady) await this.connect();
    
    try {
      const pipeline = this.client.multi();
      
      // Increment counter
      pipeline.incr(key);
      // Set expiration if it's a new key
      pipeline.expire(key, windowSeconds);
      
      const [count] = await pipeline.exec();
      
      const allowed = count <= maxRequests;
      const remaining = Math.max(0, maxRequests - count);
      
      return { allowed, remaining };
    } catch (error) {
      console.error('Redis rate limit error:', error);
      // Allow request if Redis fails
      return { allowed: true, remaining: maxRequests };
    }
  }

  // Session management
  async setSession(sessionId: string, userId: string, expiresInSeconds: number = 86400): Promise<void> {
    if (!this.isReady) await this.connect();
    
    try {
      await this.client.setEx(`session:${sessionId}`, expiresInSeconds, userId);
    } catch (error) {
      console.error('Redis setSession error:', error);
    }
  }

  async getSession(sessionId: string): Promise<string | null> {
    if (!this.isReady) await this.connect();
    
    try {
      return await this.client.get(`session:${sessionId}`);
    } catch (error) {
      console.error('Redis getSession error:', error);
      return null;
    }
  }

  async invalidateSession(sessionId: string): Promise<void> {
    if (!this.isReady) await this.connect();
    
    try {
      await this.client.del(`session:${sessionId}`);
    } catch (error) {
      console.error('Redis invalidateSession error:', error);
    }
  }
}

export default new RedisService();

// Integration with rate limiting middleware
// src/middleware/rateLimiter.ts
import { Request, Response, NextFunction } from 'express';
import redis from '../services/redis.service';

export const rateLimiter = (maxRequests: number = 100, windowSeconds: number = 900) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    const key = `ratelimit:${ip}:${req.path}`;
    
    try {
      const { allowed, remaining } = await redis.checkRateLimit(key, maxRequests, windowSeconds);
      
      res.setHeader('X-RateLimit-Limit', maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      
      if (!allowed) {
        const resetTime = Math.floor(Date.now() / 1000) + windowSeconds;
        res.setHeader('X-RateLimit-Reset', resetTime.toString());
        return res.status(429).json({
          success: false,
          error: 'Too many requests, please try again later'
        });
      }
      
      next();
    } catch (error) {
      console.error('Rate limiter error:', error);
      // Allow request if rate limiting fails
      next();
    }
  };
};

// Integration with caching middleware
// src/middleware/cache.ts
import { Request, Response, NextFunction } from 'express';
import redis from '../services/redis.service';

export const cacheMiddleware = (ttlSeconds: number = 3600) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== 'GET') return next();
    
    const cacheKey = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redis.getCache<any>(cacheKey);
      
      if (cachedData) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(cachedData);
      }
      
      // Store original send function
      const originalSend = res.json;
      
      res.json = (body: any) => {
        // Cache successful responses only
        if (res.statusCode >= 200 && res.statusCode < 300) {
          redis.setCache(cacheKey, body, ttlSeconds).catch(console.error);
        }
        res.setHeader('X-Cache', 'MISS');
        return originalSend.call(res, body);
      };
      
      next();
    } catch (error) {
      console.error('Cache middleware error:', error);
      next();
    }
  };
};

// Usage in routes
// src/api/roadmaps/roadmaps.routes.ts
import { Router } from 'express';
import { cacheMiddleware } from '../../middleware/cache';
import { rateLimiter } from '../../middleware/rateLimiter';
import { getRoadmapsHandler, getRoadmapByIdHandler } from './roadmaps.controller';

const router = Router();

// Apply rate limiting and caching to public routes
router.get('/', rateLimiter(100, 900), cacheMiddleware(3600), getRoadmapsHandler);
router.get('/:id', rateLimiter(100, 900), cacheMiddleware(1800), getRoadmapByIdHandler);

export default router;
```

## Cấu trúc mã nguồn

### Frontend Structure
```bash
frontend/
├── src/
│   ├── components/              # UI components
│   │   ├── ui/                  # Reusable UI components
│   │   │   ├── Common.tsx       # Buttons, Cards, Inputs, etc.
│   │   │   ├── Layout.tsx       # Main layout component
│   │   │   └── ...              # Other UI components
│   │   ├── interview/           # Interview-specific components
│   │   ├── learning/            # Learning-specific components
│   │   └── ...                  # Other component categories
│   │
│   ├── context/                 # React contexts
│   │   ├── AuthContext.tsx      # Authentication context
│   │   └── ...                  # Other contexts
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useInterviewSocket.ts # WebSocket hook for interviews
│   │   └── ...                  # Other custom hooks
│   │
│   ├── models/                  # TypeScript interfaces and types
│   │   ├── index.ts             # Export all types
│   │   └── ...                  # Type definitions
│   │
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx        # Dashboard page
│   │   ├── Roadmaps.tsx         # Roadmaps page
│   │   ├── Learning.tsx         # Learning page
│   │   ├── CV.tsx               # CV builder page
│   │   ├── Interview.tsx        # Interview practice page
│   │   ├── Calendar.tsx         # Calendar page
│   │   ├── Analytics.tsx        # Analytics page
│   │   ├── Admin.tsx            # Admin dashboard
│   │   ├── Login.tsx            # Login page
│   │   ├── Register.tsx         # Register page
│   │   └── ...                  # Other pages
│   │
│   ├── services/                # Service modules
│   │   ├── api.ts               # API client setup
│   │   ├── auth.ts              # Authentication service
│   │   └── ...                  # Other services
│   │
│   ├── styles/                  # CSS and styling
│   │   ├── index.css            # Global styles
│   │   └── ...                  # Other style files
│   │
│   ├── utils/                   # Utility functions
│   │   ├── formatters.ts        # Data formatting utilities
│   │   ├── validators.ts        # Validation utilities
│   │   └── ...                  # Other utilities
│   │
│   ├── App.tsx                  # Main App component
│   ├── index.tsx                # Entry point
│   └── vite-env.d.ts            # Vite environment declarations
│
├── public/                      # Static assets
│   ├── assets/                  # Images, fonts, etc.
│   └── index.html               # HTML template
│
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite configuration
└── package.json                 # Project dependencies
```

### Backend Structure
```bash
backend/
├── src/
│   ├── api/                     # API routes and controllers
│   │   ├── auth/                # Authentication routes
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── calendar/            # Calendar routes
│   │   ├── certificates/        # Certificate routes
│   │   ├── cvs/                 # CV routes
│   │   ├── exercises/           # Exercise routes
│   │   ├── interviews/          # Interview routes
│   │   ├── notes/               # Note routes
│   │   ├── progress/            # Progress tracking routes
│   │   ├── roadmaps/            # Roadmap routes
│   │   └── users/               # User management routes
│   │
│   ├── generated/               # Prisma generated code
│   │   └── prisma/              # Prisma client
│   │
│   ├── middleware/              # Express middleware
│   │   ├── authenticate.ts      # Authentication middleware
│   │   ├── ownership.ts         # Ownership checking middleware
│   │   ├── rateLimiter.ts       # Rate limiting middleware
│   │   ├── validateRequest.ts   # Request validation middleware
│   │   └── ...                  # Other middleware
│   │
│   ├── models/                  # Data models (if needed beyond Prisma)
│   │
│   ├── services/                # Business logic services
│   │   ├── file.service.ts      # File handling service
│   │   ├── groq.service.ts      # AI service integration
│   │   ├── jwt.service.ts       # JWT service
│   │   ├── prisma.service.ts    # Prisma database service
│   │   ├── redis.service.ts     # Redis caching service
│   │   └── ...                  # Other services
│   │
│   ├── types/                   # TypeScript types and interfaces
│   │   ├── express/             # Express type extensions
│   │   └── ...                  # Other type definitions
│   │
│   ├── utils/                   # Utility functions
│   │   ├── pdf.utils.ts         # PDF generation utilities
│   │   └── ...                  # Other utilities
│   │
│   ├── app.ts                   # Express app setup
│   ├── config.ts                # Configuration management
│   ├── server.ts                # Server entry point
│   └── types/                   # TypeScript declaration files
│
├── prisma/                      # Prisma schema and migrations
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
│
├── .eslintrc.js                 # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Project dependencies
└── Dockerfile                   # Docker configuration
```

---

# KẾT LUẬN

Dự án đã được triển khai thành công với kiến trúc hiện đại, sử dụng các công nghệ tiên tiến từ frontend đến backend. Hệ thống đảm bảo tính bảo mật cao, khả năng mở rộng tốt, và hiệu suất tối ưu.

## Bài học chính rút ra:
1. **Kiến trúc microservices với containers** là lựa chọn tối ưu cho các ứng dụng cần scalability cao
2. **Type safety với TypeScript** giảm đáng kể bugs và cải thiện productivity
3. **Real-time communication với WebSocket** mở ra nhiều khả năng cho interactive features
4. **CI/CD automation** là yếu tố quan trọng để đảm bảo chất lượng và tốc độ release
5. **Cloud-native architecture** trên AWS cung cấp tính linh hoạt và khả năng scale tự động

## Hướng phát triển trong tương lai:
1. **AI-powered learning paths** - Sử dụng machine learning để đề xuất roadmap học tập cá nhân hóa
2. **Progressive Web App (PWA)** - Offline support và push notifications
3. **Advanced analytics** - Predictive analytics cho learning outcomes
4. **Mobile native apps** - iOS và Android apps với React Native
5. **Multi-region deployment** - Global distribution để giảm latency

Dự án đã chứng minh khả năng áp dụng các công nghệ hiện đại vào thực tế, tạo ra một nền tảng học tập chất lượng cao với trải nghiệm người dùng xuất sắc.