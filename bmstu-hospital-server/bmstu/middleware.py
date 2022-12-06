def allow_cors_middleware(get_response):
    def middleware(request):
        response = get_response(request)
        response['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5173'
        response['Access-Control-Allow-Headers'] = 'Content-Type, X-CSRFToken'
        response['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, DELETE, PATCH, PUT, HEAD'
        response['Access-Control-Allow-Credentials'] = 'true'
        return response
    return middleware