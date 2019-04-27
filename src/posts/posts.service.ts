import { User } from './../users/user.entity';
import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { Post } from './post.entity';
import { PostDto } from './dto/post.dto';

@Injectable()
export class PostsService {
    constructor(
        @Inject('PostsRepository')
        private readonly postsRepository: typeof Post,
    ) {}

    async findAll(): Promise<PostDto[]> {
        const posts = await this.postsRepository.findAll<Post>({
            include: [User],
        });
        return posts.map(post => {
            return new PostDto(post);
        });
    }

    async create(userId: string, createPostDto: CreatePostDto): Promise<Post> {
        const post = new Post();
        post.userId = userId;
        post.title = createPostDto.title;
        post.content = createPostDto.content;

        try {
            return await post.save();
        } catch (err) {
            throw new HttpException(err, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
